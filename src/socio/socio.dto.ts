import {Column} from "typeorm";

export class SocioDTO {
  readonly codigo: number;
  readonly nombre: string;
  readonly correoelectronico: string;
  readonly fechanacimiento: string;

}
