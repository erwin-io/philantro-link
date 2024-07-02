"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYMENT_LINK_STATUS = exports.PAYMENT_METHOD = exports.PAYMENT_STATUS = exports.PAYMENT_ERROR_NOT_FOUND = void 0;
exports.PAYMENT_ERROR_NOT_FOUND = "Payment was not found!";
exports.PAYMENT_STATUS = {
    PENDING: "PENDING",
    COMPLETED: "COMPLETED",
};
exports.PAYMENT_METHOD = {
    CASH: "CASH",
    WALLET: "WALLET",
    CARD: "CARD",
};
exports.PAYMENT_LINK_STATUS = {
    SUCCEEDED: "succeeded",
    WAITING_PAYMENT: "awaiting_payment_method",
};
//# sourceMappingURL=payment.constant.js.map