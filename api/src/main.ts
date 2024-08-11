import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { RequestMethod, ValidationPipe } from "@nestjs/common";
import * as bodyParser from "body-parser";
import { NestExpressApplication } from "@nestjs/platform-express";
import hbs from "hbs";
import path from "path";
import * as dateFns from "date-fns"; // Import date-fns

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();

  // Set the views directory
  app.setBaseViewsDir(path.join(__dirname, "views"));

  // Set Handlebars as the view engine
  app.setViewEngine("hbs");

  // Register Handlebars partials
  hbs.registerPartials(path.join(__dirname, "views", "partials"));

  // Serve static assets from the public directory
  app.useStaticAssets(path.join(__dirname, "public"));

  registerHelper(hbs);

  app.setGlobalPrefix("api/v1", {
    exclude: ["payment-done", "payment-done/:transactionCode", "verify"], // Exclude view routes
  });
  // the next two lines did the trick
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>("PORT");
  const options = new DocumentBuilder()
    .setTitle("philantro-link-api")
    .setDescription("A documentation for philantro-link-api")
    .setVersion("1.0")
    .addBearerAuth(
      { type: "http", scheme: "bearer", bearerFormat: "JWT", in: "header" },
      "jwt"
    )
    .build();
  // the next two lines did the trick
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("swagger", app, document, {
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
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(port, () => {
    console.log("[WEB]", config.get<string>("BASE_URL") + "/swagger");
  });
}
bootstrap();

function registerHelper(hbs) {
  hbs.registerHelper("formatDateTime", function (date, format) {
    return dateFns.format(date ?? new Date(), format);
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
    const result: string = JSON.stringify(value);
    return result;
  });

  return hbs;
}
