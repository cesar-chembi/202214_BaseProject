import {Column} from "typeorm";

export class ClubDTO {
  readonly codigo: number;
  readonly nombre: string;
  readonly fechafundacion: string;
  readonly imagen: string;
  readonly descripcion: string;

}
