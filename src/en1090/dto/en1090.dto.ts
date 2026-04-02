import { Type } from "class-transformer";
import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
} from "class-validator";

export class UpdateEn1090FileDto {
  @IsString()
  @IsNotEmpty()
  path!: string;

  @IsString()
  content!: string;
}

export class CreateEn1090CommessaDto {
  @IsString()
  @IsNotEmpty()
  codice!: string;

  @IsString()
  @IsNotEmpty()
  cliente!: string;

  @IsString()
  @IsOptional()
  descrizione?: string;
}

export class PatchEn1090CommessaDto {
  @IsOptional()
  @IsString()
  descrizione?: string;

  @IsOptional()
  @IsIn(["aperta", "chiusa"])
  stato?: "aperta" | "chiusa";

  @IsOptional()
  @IsDateString()
  data_chiusura?: string;
}

export class SaveEn1090ModuloDto {
  @Type(() => Number)
  commessa_id!: number;

  @IsIn(["Mod04", "Mod14", "PFC"])
  tipo!: "Mod04" | "Mod14" | "PFC";

  @IsObject()
  contenuto_json!: Record<string, unknown>;
}

export class GeneratePdfDto {
  @IsString()
  markdown!: string;

  @IsOptional()
  @IsString()
  filename?: string;
}

export class GenerateEn1090DocDto {
  @Type(() => Number)
  commessa_id!: number;

  @IsOptional()
  @IsObject()
  campi_specifici?: Record<string, unknown>;
}

export class CreateEn1090MaterialeDto {
  @IsString()
  codice!: string;
  @IsString()
  descrizione!: string;
  @IsOptional()
  @IsString()
  norma?: string;
  @IsOptional()
  @IsString()
  certificatoPath?: string;
  @IsOptional()
  @IsString()
  fornitore?: string;
  @IsOptional()
  @IsString()
  lotto?: string;
  @IsDateString()
  dataIngresso!: string;
}

export class UpdateEn1090MaterialeDto {
  @IsOptional()
  @IsString()
  descrizione?: string;
  @IsOptional()
  @IsString()
  norma?: string;
  @IsOptional()
  @IsString()
  certificatoPath?: string;
  @IsOptional()
  @IsString()
  fornitore?: string;
  @IsOptional()
  @IsString()
  lotto?: string;
}

export class AssociaMaterialeCommessaDto {
  @IsString()
  materialeId!: string;
  @IsOptional()
  @Type(() => Number)
  quantita?: number;
  @IsOptional()
  @IsString()
  note?: string;
}

export class CreateEn1090SaldatoreDto {
  @IsString()
  nome!: string;
  @IsOptional()
  @IsString()
  matricola?: string;
}

export class CreateEn1090WpsDto {
  @IsString()
  codice!: string;
  @IsString()
  descrizione!: string;
  @IsOptional()
  @IsString()
  processo?: string;
  @IsOptional()
  @Type(() => Number)
  spessoreMin?: number;
  @IsOptional()
  @Type(() => Number)
  spessoreMax?: number;
  @IsOptional()
  @IsString()
  posizione?: string;
  @IsOptional()
  @IsString()
  materiale?: string;
  @IsOptional()
  @IsString()
  wpqrId?: string;
}

export class CreateEn1090WpqrDto {
  @IsString()
  codice!: string;
  @IsOptional()
  @IsString()
  descrizione?: string;
  @IsOptional()
  @IsString()
  certificatoPath?: string;
  @IsOptional()
  @IsDateString()
  dataProva?: string;
  @IsOptional()
  @IsDateString()
  dataScadenza?: string;
}

export class CreateEn1090QualificaDto {
  @IsString()
  saldatoreId!: string;
  @IsString()
  norma!: string;
  @IsString()
  processo!: string;
  @IsOptional()
  @Type(() => Number)
  spessoreMin?: number;
  @IsOptional()
  @Type(() => Number)
  spessoreMax?: number;
  @IsOptional()
  @IsString()
  posizione?: string;
  @IsOptional()
  @IsDateString()
  dataQualifica?: string;
  @IsOptional()
  @IsDateString()
  dataScadenza?: string;
  @IsOptional()
  @IsString()
  certificatoPath?: string;
}

export class CreateEn1090SaldaturaDto {
  @Type(() => Number)
  commessaId!: number;
  @IsString()
  saldatoreId!: string;
  @IsString()
  wpsId!: string;
  @IsString()
  giunto!: string;
  @IsOptional()
  @IsString()
  materialeId?: string;
  @IsDateString()
  dataSaldatura!: string;
  @IsOptional()
  @IsObject()
  controlli?: Record<string, unknown>;
  @IsOptional()
  @IsString()
  esito?: string;
  @IsOptional()
  @IsString()
  note?: string;
}

export class En1090VerificaSaldaturaDto {
  @Type(() => Number)
  commessaId!: number;

  @IsOptional()
  @IsString()
  saldaturaId?: string;

  @IsOptional()
  @IsString()
  wpsId?: string;

  @IsOptional()
  @IsString()
  materialeId?: string;

  @IsString()
  tipoGiunto!: string;

  @IsString()
  tipoSollecitazione!: string;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  spessoreElemento?: number;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  golaEffettiva?: number;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  lunghezza?: number;

  @IsOptional()
  @Type(() => Number)
  forzaNormaleEd?: number;

  @IsOptional()
  @Type(() => Number)
  taglioParalleloEd?: number;

  @IsOptional()
  @Type(() => Number)
  taglioPerpendicolareEd?: number;

  @IsOptional()
  @Type(() => Number)
  momentoEd?: number;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  fvwk?: number;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  gammaM2?: number;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  betaW?: number;
}

export class En1090CertificatoPathDto {
  @IsString()
  @IsNotEmpty()
  path!: string;
}

export class En1090CreaMaterialeDaCertificatoDto {
  @IsString()
  @IsNotEmpty()
  path!: string;

  @IsOptional()
  @IsString()
  codice?: string;

  @IsOptional()
  @IsString()
  descrizione?: string;

  @IsOptional()
  @IsString()
  norma?: string;

  @IsOptional()
  @IsString()
  fornitore?: string;

  @IsOptional()
  @IsString()
  lotto?: string;

  @IsOptional()
  @IsString()
  colata?: string;

  @IsOptional()
  @IsString()
  acciaio?: string;

  @IsOptional()
  @IsObject()
  analisiChimica?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  proprietaMeccaniche?: Record<string, unknown>;
}
