import { HttpService } from "@nestjs/axios";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom, catchError } from "rxjs";
import url from "url";
import querystring from "querystring";
import { InjectRepository } from "@nestjs/typeorm";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { Repository } from "typeorm";
import { Transactions } from "src/db/entities/Transactions";
import {
  PAYMENT_LINK_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
} from "src/common/constant/payment.constant";
import { CONST_QUERYCURRENT_TIMESTAMP } from "src/common/constant/timestamp.constant";
import { Users } from "src/db/entities/Users";
import { USER_ERROR_USER_NOT_FOUND } from "src/common/constant/user-error.constant";
import {
  columnDefToTypeORMCondition,
  generateIndentityCode,
} from "src/common/utils/utils";
import { Events } from "src/db/entities/Events";
import {
  EVENT_ERROR_NOT_FOUND,
  EVENT_TYPE,
} from "src/common/constant/events.constant";
import { USER_TYPE } from "src/common/constant/user-type.constant";

@Injectable()
export class TransactionsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
    private firebaseProvoder: FirebaseProvider,
    @InjectRepository(Transactions)
    private readonly transactionsRepo: Repository<Transactions>
  ) {}

  async getPagination({ pageSize, pageIndex, order, columnDef }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);
    const condition = columnDefToTypeORMCondition(columnDef);
    const [results, total] = await Promise.all([
      this.transactionsRepo.find({
        where: {
          isCompleted: true,
          status: "COMPLETED",
          ...condition,
        },
        relations: {
          user: {
            userProfilePic: true,
          },
        },
        skip,
        take,
        order,
      }),
      this.transactionsRepo.count({
        where: {
          isCompleted: true,
          status: "COMPLETED",
          ...condition,
        },
      }),
    ]);
    return {
      results: results.map((x) => {
        delete x.user?.password;
        return x;
      }),
      total,
    };
  }

  async getByCode(transactionCode) {
    try {
      const transaction = await this.transactionsRepo.findOne({
        where: {
          transactionCode,
        },
        relations: {
          user: true,
          event: {
            user: true,
          },
        },
      });
      if (!transaction) {
        throw new Error("Transaction not found!");
      }
      delete transaction.user.password;
      if (!transaction?.referenceCode && transaction?.referenceCode === "") {
        throw new Error("Transaction payment data not valid!");
      }
      const base64data = new Buffer(
        this.config.get<string>("PAYMENT_SECRET_KEY")
      ).toString("base64");

      const result = await this.httpService
        .get<any>(
          `https://api.paymongo.com/v1/checkout_sessions/${transaction?.referenceCode}`,
          {
            responseType: "json",
            headers: {
              Origin: "https://api.paymongo.com",
              "Content-Type": "application/json",
              Authorization: `Basic ${base64data}`,
            },
          }
        )
        .pipe(
          catchError((error) => {
            if (
              error.response &&
              error.response?.data &&
              error.response?.data?.errors &&
              error.response?.data?.errors[0] &&
              error.response?.data?.errors[0]?.detail &&
              error.response?.data?.errors[0]?.detail !== ""
            ) {
              let message = error.response?.data?.errors[0]?.detail;
              if (
                message.includes("No") &&
                message.includes("No such") &&
                message.includes("checkout") &&
                message.includes("session") &&
                message.includes("id") &&
                message.includes(transaction?.referenceCode)
              ) {
                message =
                  "We apologize, but we couldn't locate your payment in our database";
              }
              throw new HttpException(message, HttpStatus.BAD_REQUEST);
            } else if (error.message && error.message !== "") {
              throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
            } else {
              throw new HttpException("Bad request!", HttpStatus.BAD_REQUEST);
            }
          })
        )
        .toPromise();
      if (
        result?.data &&
        result?.data?.data &&
        result?.data?.data?.attributes
      ) {
        const { checkout_url, payments, payment_intent } =
          result?.data?.data?.attributes;
        if (
          payment_intent &&
          payment_intent?.attributes &&
          payment_intent?.attributes?.status
        ) {
          return {
            ...transaction,
            paymentData: {
              id: result?.data?.data?.id,
              checkout_url,
              payment_intent: {
                id: payment_intent.id,
                status: payment_intent.attributes?.status,
              },
              paid: payments && payments.length > 0,
            },
          };
        } else {
          return {
            ...transaction,
            paymentData: {
              id: result?.data?.data?.id,
              checkout_url,
              paid: payments && payments.length > 0,
              transaction,
            },
          };
        }
      } else {
        return null;
      }
    } catch (ex) {
      throw ex;
    }
  }

  async requestPaymentLink({ amount, userId, eventId }) {
    return await this.transactionsRepo.manager.transaction(
      async (entityManager) => {
        try {
          let transactions = new Transactions();
          const timestamp = await entityManager
            .query(CONST_QUERYCURRENT_TIMESTAMP)
            .then((res) => {
              return res[0]["timestamp"];
            });
          transactions.dateTime = timestamp;
          transactions.amount = amount;
          const event = await entityManager.findOne(Events, {
            where: {
              eventId,
            },
          });
          if (!event) {
            throw new HttpException(
              EVENT_ERROR_NOT_FOUND,
              HttpStatus.BAD_REQUEST
            );
          }
          if (event.eventType !== EVENT_TYPE.DONATION) {
            throw new HttpException(
              "The selected event is not a donation type of event!",
              HttpStatus.BAD_REQUEST
            );
          }
          if (
            !event.transferType ||
            event.transferType === "" ||
            !event.transferAccountName ||
            !event.transferAccountNumber ||
            ![
              PAYMENT_METHOD.CARD,
              PAYMENT_METHOD.CASH,
              PAYMENT_METHOD.WALLET,
            ].some((x) => x === event.transferType.toUpperCase())
          ) {
            throw new HttpException(
              "The selected donation event has an invalid receiving account setup!",
              HttpStatus.BAD_REQUEST
            );
          }
          transactions.event = event;
          const user = await entityManager.findOne(Users, {
            where: {
              userId,
            },
          });
          if (!user) {
            throw new HttpException(
              USER_ERROR_USER_NOT_FOUND,
              HttpStatus.BAD_REQUEST
            );
          }
          if (user.userType !== USER_TYPE.CLIENT) {
            throw new HttpException(
              "Invalid user type",
              HttpStatus.BAD_REQUEST
            );
          }
          transactions.user = user;
          transactions.paymentType = PAYMENT_METHOD.WALLET;
          transactions.fromAccountNumber = user.mobileNumber;
          transactions.fromAccountName = user.name;
          transactions.toAccountNumber = event.transferAccountNumber;
          transactions.toAccountName = event.transferAccountName;
          transactions.bank = "ONLINE";
          transactions = await entityManager.save(Transactions, transactions);
          transactions.transactionCode = generateIndentityCode(
            transactions.transactionId
          );
          transactions = await entityManager.save(Transactions, transactions);
          const params = {
            data: {
              attributes: {
                send_email_receipt: false,
                show_description: true,
                show_line_items: false,
                payment_method_types: ["gcash", "grab_pay", "paymaya"],
                line_items: [
                  {
                    currency: "PHP",
                    amount: Number(amount) * 100,
                    quantity: 1,
                    name: "Top up",
                  },
                ],
                description: "Top up",
                success_url: `${this.config.get<string>(
                  "PAYMENT_SUCCESS_PAGE"
                )}/${transactions.transactionCode}`,
              },
            },
          };
          const base64data = new Buffer(
            this.config.get<string>("PAYMENT_SECRET_KEY")
          ).toString("base64");

          const result = await firstValueFrom(
            this.httpService
              .post<any>(
                `https://api.paymongo.com/v1/checkout_sessions`,
                params,
                {
                  responseType: "json",
                  headers: {
                    Origin: "https://api.paymongo.com",
                    "Content-Type": "application/json",
                    Authorization: `Basic ${base64data}`,
                  },
                }
              )
              .pipe(
                catchError((error) => {
                  if (
                    error.response &&
                    error.response?.data &&
                    error.response?.data?.errors &&
                    error.response?.data?.errors[0] &&
                    error.response?.data?.errors[0]?.detail &&
                    error.response?.data?.errors[0]?.detail !== ""
                  ) {
                    let message = error.response?.data?.errors[0]?.detail;
                    if (
                      message.includes("total") &&
                      message.includes("amount") &&
                      message.includes("cannot") &&
                      message.includes("less")
                    ) {
                      message = "The total amount cannot be less than 20";
                    }
                    throw new HttpException(message, HttpStatus.BAD_REQUEST);
                  } else if (error.message && error.message !== "") {
                    throw new HttpException(
                      error.message,
                      HttpStatus.BAD_REQUEST
                    );
                  } else {
                    throw new HttpException(
                      "Bad request!",
                      HttpStatus.BAD_REQUEST
                    );
                  }
                })
              )
          );
          if (
            result?.data &&
            result?.data?.data &&
            result?.data?.data?.attributes
          ) {
            const { checkout_url, payments, payment_intent } =
              result?.data?.data?.attributes;
            if (
              result?.data?.data?.id &&
              payment_intent &&
              payment_intent?.attributes &&
              payment_intent?.attributes?.status
            ) {
              transactions.referenceCode = result?.data?.data?.id;
              transactions = await entityManager.save(
                Transactions,
                transactions
              );
              return {
                transactions,
                id: result?.data?.data?.id,
                checkout_url,
                payment_intent: {
                  id: payment_intent.id,
                  status: payment_intent.status,
                },
                paid: payments && payments.length > 0,
              };
            } else {
              transactions.referenceCode = result?.data?.data?.id;
              transactions = await entityManager.save(
                Transactions,
                transactions
              );
              return {
                transactions,
                id: result?.data?.data?.id,
                checkout_url,
                paid: payments && payments.length > 0,
              };
            }
          } else {
            throw new HttpException(
              "Sorry, we encountered an error processing your payment. Please try again later",
              HttpStatus.BAD_REQUEST
            );
          }
        } catch (ex) {
          throw ex;
        }
      }
    );
  }

  async comleteTopUpPayment(transactionCode) {
    return await this.transactionsRepo.manager.transaction(
      async (entityManager) => {
        try {
          const getTransaction = await this.getByCode(transactionCode);
          if (
            (getTransaction &&
              getTransaction?.paymentData &&
              getTransaction?.paymentData?.id &&
              getTransaction?.paymentData?.id !== "",
            getTransaction?.paymentData?.paid)
          ) {
            let transaction = await entityManager.findOne(Transactions, {
              where: {
                transactionCode,
              },
            });
            if (!transaction) {
              throw new HttpException(
                "We apologize, but we couldn't locate your payment in our database. Kindly wait for a moment and attempt the transaction again shortly.",
                HttpStatus.BAD_REQUEST
              );
            }
            if (
              getTransaction?.paymentData?.paid ||
              getTransaction?.paymentData?.payment_intent.status ===
                PAYMENT_LINK_STATUS.SUCCEEDED
            ) {
              transaction.isCompleted = true;
              transaction.status = PAYMENT_STATUS.COMPLETED;
              transaction = await entityManager.save(Transactions, transaction);
              transaction = await entityManager.findOne(Transactions, {
                where: {
                  transactionId: transaction.transactionId,
                },
                relations: {
                  user: true,
                },
              });
            } else if (
              getTransaction?.paymentData?.paid ||
              getTransaction?.paymentData?.payment_intent.status ===
                PAYMENT_LINK_STATUS.WAITING_PAYMENT
            ) {
              throw new HttpException(
                "We're sorry, but your payment hasn't been confirmed or completed yet. Please wait a few moments and try again later.",
                HttpStatus.BAD_REQUEST
              );
            } else {
              throw new HttpException(
                "Sorry, we encountered an error processing your payment. Please try again later",
                HttpStatus.BAD_REQUEST
              );
            }
          } else {
            throw new HttpException(
              "Sorry, we encountered an error processing your payment. Please try again later",
              HttpStatus.BAD_REQUEST
            );
          }
        } catch (ex) {
          throw ex;
        }
      }
    );
  }

  async expirePaymentLink(id) {
    try {
      const base64data = new Buffer(
        "sk_test_PaJ2xyGtup94CxoLHLQRmHVz"
      ).toString("base64");

      const result = await firstValueFrom(
        this.httpService
          .post<any>(
            `https://api.paymongo.com/v1/checkout_sessions/${id}/expire`,
            {},
            {
              responseType: "json",
              headers: {
                Origin: "https://api.paymongo.com",
                "Content-Type": "application/json",
                Authorization: `Basic ${base64data}`,
              },
            }
          )
          .pipe(
            catchError((error) => {
              if (
                error.response &&
                error.response?.data &&
                error.response?.data?.errors &&
                error.response?.data?.errors[0] &&
                error.response?.data?.errors[0]?.detail &&
                error.response?.data?.errors[0]?.detail !== ""
              ) {
                let message = error.response?.data?.errors[0]?.detail;
                if (
                  message.includes("Checkout") &&
                  message.includes("Session") &&
                  message.includes("already") &&
                  message.includes("expired") &&
                  message.includes(id)
                ) {
                  message = "Payment already cancelled!";
                }
                throw new HttpException(message, HttpStatus.BAD_REQUEST);
              } else if (error.message && error.message !== "") {
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
              } else {
                throw new HttpException("Bad request!", HttpStatus.BAD_REQUEST);
              }
            })
          )
      );
      if (
        result?.data &&
        result?.data?.data &&
        result?.data?.data?.attributes
      ) {
        const { checkout_url, payments, payment_intent } =
          result?.data?.data?.attributes;
        if (
          payment_intent &&
          payment_intent?.attributes &&
          payment_intent?.attributes?.status
        ) {
          return {
            id: result?.data?.data?.id,
            checkout_url,
            payment_intent: {
              id: payment_intent.id,
              status: payment_intent.status,
            },
            paid: payments && payments.length > 0,
          };
        } else {
          return {
            id: result?.data?.data?.id,
            checkout_url,
            paid: payments && payments.length > 0,
          };
        }
      } else {
        return null;
      }
    } catch (ex) {
      throw ex;
    }
  }
}
