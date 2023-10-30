import { ApiProperty } from '@nestjs/swagger';

/**
 * Padrão adotado pela IETF
 * RFC 7807: https://datatracker.ietf.org/doc/html/rfc7807
 * Internet Engineering Task Force: https://ietf.org/
 */
export class ProblemDetailsDto {
  constructor(
    data: Omit<ProblemDetailsDto, 'instance'> & { instance?: string },
  ) {
    this.title = data.title;
    this.detail = data.detail;

    this.instance = data.instance;
  }

  /**
   * A URI reference [RFC3986] that identifies the
   * problem type.  This specification encourages that, when
   * dereferenced, it provide human-readable documentation for the
   * problem type (e.g., using HTML [W3C.REC-html5-20141028]).  When
   * this member is not present, its value is assumed to be
   * "about:blank".
   */
  type?: string;

  /**
   * Código do erro
   */
  @ApiProperty()
  title: string; // AUTH_RESPON

  /**
   * @description
   * Mensagem amigável sobre o erro que aconteceu.
   */
  @ApiProperty()
  detail: string;

  /**
   * @description
   * Path da requisição
   */
  @ApiProperty()
  instance: string;
}
