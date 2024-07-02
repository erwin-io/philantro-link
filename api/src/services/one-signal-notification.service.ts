import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { text } from "express";
import { firstValueFrom, catchError } from "rxjs";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class OneSignalNotificationService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService
  ) {}

  async sendToExternalUser(
    userId: string,
    type: "EVENTS" | "SUPPORT_TICKET" | "MESSAGE" | any,
    referenceId,
    notificationIds: any[],
    title,
    description
  ) {
    const url = this.config.get<string>("ONE_SIGNAL_NOTIF_URL");
    const apiKey = this.config.get<string>("ONE_SIGNAL_API_KEY");
    const large_icon = this.config.get<string>("ONE_SIGNAL_NOTIF_IMAGE");
    let result;
    try {
      result = await firstValueFrom(
        this.httpService
          .post<any>(
            url,
            {
              app_id: this.config.get<string>("ONE_SIGNAL_APP_ID"),
              include_external_user_ids: [userId],
              data: {
                notificationIds,
                type,
                referenceId,
              },
              large_icon: large_icon,
              // big_picture: this.config.get<string>("ONE_SIGNAL_NOTIF_IMAGE"),
              headings: {
                en: title,
              },
              contents: {
                en: description,
              },
              android_sound: this.config.get<string>(
                "ONE_SIGNAL_NOTIF_A_SOUND"
              ),
              existing_android_channel_id: this.config.get<string>(
                "ONE_SIGNAL_NOTIF_A_EXISTING_CHANNEL_ID"
              ),
            },
            {
              responseType: "json",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Basic " + apiKey,
              },
            }
          )
          .pipe(
            catchError((error) => {
              throw new HttpException(error.response, HttpStatus.BAD_REQUEST);
            })
          )
      );
    } catch (ex) {
      return { userId, success: false };
    }
    return { userId, success: true };
  }

  async sendToUserWithTags(
    tags: { key: string; value: string }[],
    type: "EVENTS" | "SUPPORT_TICKET" | "MESSAGE" | any,
    referenceId,
    title,
    description
  ) {
    const url = this.config.get<string>("ONE_SIGNAL_NOTIF_URL");
    const apiKey = this.config.get<string>("ONE_SIGNAL_API_KEY");
    const large_icon = this.config.get<string>("ONE_SIGNAL_NOTIF_IMAGE");
    let result;
    try {
      result = await firstValueFrom(
        this.httpService
          .post<any>(
            url,
            {
              app_id: this.config.get<string>("ONE_SIGNAL_APP_ID"),
              // include_external_user_ids: [userId],
              filters: this.reformatArray(tags),
              data: {
                type,
                referenceId,
                tags,
              },
              large_icon: large_icon,
              // big_picture: this.config.get<string>("ONE_SIGNAL_NOTIF_IMAGE"),
              headings: {
                en: title,
              },
              contents: {
                en: description,
              },
              android_sound: this.config.get<string>(
                "ONE_SIGNAL_NOTIF_A_SOUND"
              ),
              existing_android_channel_id: this.config.get<string>(
                "ONE_SIGNAL_NOTIF_A_EXISTING_CHANNEL_ID"
              ),
            },
            {
              responseType: "json",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Basic " + apiKey,
              },
            }
          )
          .pipe(
            catchError((error) => {
              throw new HttpException(error.response, HttpStatus.BAD_REQUEST);
            })
          )
      );
    } catch (ex) {
      return { tags, success: false };
    }
    return { tags, success: true };
  }

  async setExternalUserId(subscriptionId: string, externalUserId: string) {
    const url = this.config.get<string>("ONE_SIGNAL_PLAYERS_URL");
    const apiKey = this.config.get<string>("ONE_SIGNAL_API_KEY");
    let result;
    try {
      result = await firstValueFrom(
        this.httpService
          .put<any>(
            url.slice(-1) === "/"
              ? `${url}${subscriptionId}`
              : `${url}/${subscriptionId}`,
            {
              app_id: this.config.get<string>("ONE_SIGNAL_APP_ID"),
              external_user_id: externalUserId,
            },
            {
              responseType: "json",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Basic " + apiKey,
              },
            }
          )
          .pipe(
            catchError((error) => {
              throw new HttpException(error.response, HttpStatus.BAD_REQUEST);
            })
          )
      );
    } catch (ex) {
      return ex.message;
    }
    console.log(result?.data);
    return result?.data;
  }

  async setTags(subscriptionId: string, tags: any) {
    const url = this.config.get<string>("ONE_SIGNAL_PLAYERS_URL");
    const apiKey = this.config.get<string>("ONE_SIGNAL_API_KEY");
    let result;
    try {
      result = await firstValueFrom(
        this.httpService
          .put<any>(
            url.slice(-1) === "/"
              ? `${url}${subscriptionId}`
              : `${url}/${subscriptionId}`,
            {
              app_id: this.config.get<string>("ONE_SIGNAL_APP_ID"),
              tags,
            },
            {
              responseType: "json",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Basic " + apiKey,
              },
            }
          )
          .pipe(
            catchError((error) => {
              throw new HttpException(error.response, HttpStatus.BAD_REQUEST);
            })
          )
      );
    } catch (ex) {
      return ex.message;
    }
    return result?.data;
  }

  reformatArray(inputArray) {
    let formattedArray = inputArray.map((item) => ({
      field: "tag",
      key: item.key,
      value: item.value,
      relation: "=", // Assuming a static value for 'relation'
    }));

    if (formattedArray.length > 1) {
      const withOperators = [];
      for (let i = 0; i < formattedArray.length; i++) {
        withOperators.push(formattedArray[i]);
        if (i < formattedArray.length - 1) {
          withOperators.push({ operator: "OR" });
        }
      }
      formattedArray = withOperators;
    }

    return formattedArray;
  }
}
