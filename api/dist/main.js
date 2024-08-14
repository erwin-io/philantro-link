"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const bodyParser = __importStar(require("body-parser"));
const hbs_1 = __importDefault(require("hbs"));
const path_1 = __importDefault(require("path"));
const dateFns = __importStar(require("date-fns"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.setBaseViewsDir(path_1.default.join(__dirname, "views"));
    app.setViewEngine("hbs");
    hbs_1.default.registerPartials(path_1.default.join(__dirname, "views", "partials"));
    app.useStaticAssets(path_1.default.join(__dirname, "public"));
    registerHelper(hbs_1.default);
    app.setGlobalPrefix("api/v1", {
        exclude: [
            "payment-done",
            "payment-done/:transactionCode",
            "verify",
            ".well-known/assetlinks.json"
        ],
    });
    app.use(bodyParser.json({ limit: "50mb" }));
    app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
    const config = app.get(config_1.ConfigService);
    const port = config.get("PORT");
    const options = new swagger_1.DocumentBuilder()
        .setTitle("philantro-link-api")
        .setDescription("A documentation for philantro-link-api")
        .setVersion("1.0")
        .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT", in: "header" }, "jwt")
        .build();
    app.use(bodyParser.json({ limit: "50mb" }));
    app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup("swagger", app, document, {
        swaggerOptions: { defaultModelsExpandDepth: -1 },
        customfavIcon: "https://avatars0.githubusercontent.com/u/7658037?v=3&s=200",
        customJs: [
            "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js",
        ],
        customCssUrl: [
            "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css",
        ],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    await app.listen(port, () => {
        console.log("[WEB]", config.get("BASE_URL") + "/swagger");
    });
}
bootstrap();
function registerHelper(hbs) {
    hbs.registerHelper("formatDateTime", function (date, format) {
        return dateFns.format(date !== null && date !== void 0 ? date : new Date(), format);
    });
    hbs.registerHelper("formatCurrency", function (value) {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "PHP",
        }).format(value);
    });
    hbs.registerHelper("eq", function (value, compare) {
        return compare === value;
    });
    hbs.registerHelper("json", function (value) {
        const result = JSON.stringify(value);
        return result;
    });
    return hbs;
}
//# sourceMappingURL=main.js.map