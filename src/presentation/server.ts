import express from "express";
import path from "path";

interface Options {
  port: number;
  publicPath: string;
}

export class Server {
  private app = express();
  private readonly port: number;
  private readonly publicPath: string;

  constructor(options: Options) {
    this.port = options.port;
    this.publicPath = options.publicPath;
  }

  async start() {
    //middleware

    //public folder

    this.app.use(express.static(this.publicPath));

    this.app.use((req, res) => {
      const indexPatn = path.join(
        __dirname,
        `../../${this.publicPath}/index.html`
      );
      res.sendFile(indexPatn);

      // res.sendFile(path.join(process.cwd(), "public", "index.html"));
    });

    this.app.listen(this.port, () => {
      console.log("Server running on port 3000");
    });
  }
}
