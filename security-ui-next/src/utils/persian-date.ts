// @ts-nocheck

export class PersianDate extends Date {
  constructor(...args) {
    super(...args);
  }

  toLocaleDateString() {
    return super.toLocaleDateString('fa-IR-u-nu-latn').split('/').map(x => x.padStart(2, '0')).join('/');
  }

  toPersianDateString() {
    return this.toLocaleDateString();
  }

  getParts() {
    return this.toLocaleDateString().split('/').map(Number);
  }

  getDay() {
    return super.getDay() === 6 ? 0 : super.getDay() + 1;
  }

  getDate() {
    return this.getParts()[2];
  }

  getMonth() {
    return this.getParts()[1] - 1;
  }

  getYear() {
    return this.getParts()[0];
  }

  getMonthName() {
    return super.toLocaleDateString('fa-IR', { month: 'long' });
  }

  getDayName() {
    return super.toLocaleDateString('fa-IR', { weekday: 'long' });
  }

  isPersianLeapYer(year: number = this.getYear()): boolean {
    return ((((((year - ((year > 0) ? 474 : 473)) % 2820) + 474) + 38) * 682) % 2816) < 682;
  }

  getDaysInMonth(year: number = this.getYear(), month: number = this.getMonth() + 1) {
    if (month <= 6) {
      return 31;
    }
    if (month <= 11) {
      return 30;
    }
    return this.isPersianLeapYer(year) ? 30 : 29;
  }

  getFirstOfMonth(year: number = this.getYear(), month: number = this.getMonth() + 1) {
    return PersianDate.fromString(`${ year }/${ month }/1`);
  }

  asDate() {
    return new Date(this)
  }

  static fromString(date = '') {
    const [ year, month, day ] = date.split('/').map(Number);
    return new PersianDate(persianToCalendars(year, month, day));
  };
}

export function persianToCalendars(year, month, day, op = {}) {
  const formatOut = gD => 'toCal' in op ? (op.calendar = op.toCal, new Intl.DateTimeFormat(op.locale ?? 'en', op).format(gD)) : gD,
    dFormat = new Intl.DateTimeFormat('en-u-ca-persian', { dateStyle: 'short', timeZone: 'UTC' });
  let gD = new Date(Date.UTC(2000, month, day));
  gD = new Date(gD.setUTCDate(gD.getUTCDate() + 226867));
  const gY = gD.getUTCFullYear() - 2000 + year;
  gD = new Date(((gY < 0) ? '-' : '+') + ('00000' + Math.abs(gY)).slice(-6) + '-' + ('0' + (gD.getUTCMonth() + 1)).slice(-2) + '-' + ('0' + (gD.getUTCDate())).slice(-2));
  let [ pM, pD, pY ] = [ ...dFormat.format(gD).split('/') ], i = 0;
  gD = new Date(gD.setUTCDate(gD.getUTCDate() +
    ~~(year * 365.25 + month * 30.44 + day - (pY.split(' ')[0] * 365.25 + pM * 30.44 + pD * 1)) - 2));
  while (i < 4) {
    [ pM, pD, pY ] = [ ...dFormat.format(gD).split('/') ];
    if (pD == day && pM == month && pY.split(' ')[0] == year) return formatOut(gD);
    gD = new Date(gD.setUTCDate(gD.getUTCDate() + 1));
    i++;
  }
  throw new Error('Invalid Persian Date!');
}
