function crc16(payload: string): string {
  let crc = 0xFFFF;

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;

    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }

  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

function formatPixField(id: string, value: string): string {
  const length = value.length.toString().padStart(2, '0');
  return `${id}${length}${value}`;
}

export interface PixPayload {
  pixKey: string;
  description: string;
  merchantName: string;
  merchantCity: string;
  amount: number;
}

export function generatePixPayload({
  pixKey,
  description,
  merchantName,
  merchantCity,
  amount,
}: PixPayload): string {
  const payloadFormatIndicator = formatPixField('00', '01');

  const merchantAccountInfo =
    formatPixField('00', 'BR.GOV.BCB.PIX') +
    formatPixField('01', pixKey);
  const merchantAccount = formatPixField('26', merchantAccountInfo);

  const merchantCategoryCode = formatPixField('52', '0000');
  const transactionCurrency = formatPixField('53', '986');
  const transactionAmount = formatPixField('54', amount.toFixed(2));
  const countryCode = formatPixField('58', 'BR');
  const merchantNameField = formatPixField('59', merchantName.substring(0, 25));
  const merchantCityField = formatPixField('60', merchantCity.substring(0, 15));

  const additionalDataField = formatPixField('05', description.substring(0, 25));
  const additionalData = formatPixField('62', additionalDataField);

  const payloadWithoutCRC =
    payloadFormatIndicator +
    merchantAccount +
    merchantCategoryCode +
    transactionCurrency +
    transactionAmount +
    countryCode +
    merchantNameField +
    merchantCityField +
    additionalData +
    '6304';

  const checksum = crc16(payloadWithoutCRC);

  return payloadWithoutCRC + checksum;
}

export function generatePixCopyPaste(payload: string): string {
  return payload;
}
