import express, { Router } from "express";
import path from "path";

interface Options {
  port: number;
  publicPath: string;
  router: Router;
}

export class Server {
  private app = express();
  private readonly port: number;
  private readonly publicPath: string;
  private readonly router: Router;

  constructor(options: Options) {
    this.port = options.port;
    this.publicPath = options.publicPath;
    this.router = options.router;
  }

  async start() {
    //middleware
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    //public folder
    this.app.use(express.static(this.publicPath));

    //* Routes
    this.app.use(this.router);

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
