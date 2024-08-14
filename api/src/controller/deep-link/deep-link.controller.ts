import { Controller, Get, Res } from "@nestjs/common";
import { readFile } from "fs/promises"; // ES6 import for file system access
import { createReadStream } from "fs";
import path from "path";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";


@Controller(".well-known")
export class DeepLinkController {
  constructor(private readonly config: ConfigService) {}
  
  @Get("assetlinks.json")
  async getJsonFile(@Res() res: Response) {
    const jsonPath = "../../assets/assetlinks.json"; //this.config.get<string>("EV_RESET_TEMPLATE_PATH");
    // const jsonFilePath = await readFile(
    //   path.join(__dirname, jsonPath),
    //   "utf-8"
    // );
    const fileStream = createReadStream(path.join(__dirname, jsonPath));
    fileStream.pipe(res);
  }
}
