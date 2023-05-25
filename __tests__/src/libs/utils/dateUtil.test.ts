import dateUtil from '../../../../libs/utils/src/dateUtil'

const {
  HMS_FORMAT,
  isValidDate,
  parseMS,
  parseHMS,
  parseToYmd,
  parseSecToHMS,
  getDateInfo,
  addDays,
  getStartDay,
  getDiffDays,
  fixZero,
} = dateUtil

describe('dateUtil.isValidDate', () => {
  test('number', () => {
    expect(isValidDate(new Date(1560211200000))).toBe(true)
  })
  test('number, invalid case', () => {
    expect(isValidDate(new Date(8888234234232342))).toBe(false)
  })
  test('string', () => {
    expect(isValidDate(new Date('2008-11-03T03:59:59'))).toBe(true)
  })
  test('string, invalid case', () => {
    expect(isValidDate(new Date('2010/19/7 11:20:7'))).toBe(false)
  })
})

describe('dateUtil.parseMS', () => {
  test('seconds greater than sixty', () => {
    expect(parseMS(5487)).toStrictEqual({ minutes: 91, seconds: 27 })
  })
  test('seconds less than sixty', () => {
    expect(parseMS(19)).toStrictEqual({ minutes: 0, seconds: 19 })
  })
  test('float number greater than sixty', () => {
    expect(parseMS(63.8787103)).toStrictEqual({ minutes: 1, seconds: 4 })
  })
  test('float number less than sixty', () => {
    expect(parseMS(7.2787103)).toStrictEqual({ minutes: 0, seconds: 7 })
  })
  test('zero case', () => {
    expect(parseMS(0)).toStrictEqual({ minutes: 0, seconds: 0 })
  })
  test('negative number', () => {
    expect(parseMS(-6.31488)).toStrictEqual({ minutes: 0, seconds: 0 })
  })
})

describe('dateUtil.parseHMS', () => {
  test('seconds greater than 2 hours', () => {
    expect(parseHMS(15487)).toStrictEqual({ hours: 4, minutes: 18, seconds: 7 })
  })
  test('seconds greater than sixty', () => {
    expect(parseHMS(677)).toStrictEqual({ hours: 0, minutes: 11, seconds: 17 })
  })
  test('seconds less than sixty', () => {
    expect(parseHMS(19)).toStrictEqual({ hours: 0, minutes: 0, seconds: 19 })
  })
  test('float number greater than sixty', () => {
    expect(parseHMS(63.8787103)).toStrictEqual({ hours: 0, minutes: 1, seconds: 4 })
  })
  test('float number less than sixty', () => {
    expect(parseHMS(7.2787103)).toStrictEqual({ hours: 0, minutes: 0, seconds: 7 })
  })
  test('zero case', () => {
    expect(parseHMS(0)).toStrictEqual({ hours: 0, minutes: 0, seconds: 0 })
  })
  test('negative number', () => {
    expect(parseHMS(-6.31488)).toStrictEqual({ hours: 0, minutes: 0, seconds: 0 })
  })
})

describe('dateUtil.parseToYmd', () => {
  test('yyyy/mm/dd normal string', () => {
    expect(parseToYmd(new Date('2010/9/7'))).toBe('2010/09/07')
  })
  test('yyyy/mm/dd normal number', () => {
    expect(parseToYmd(new Date(1560211200000))).toBe('2019/06/11')
  })
  test('yyyy/mm/dd hh', () => {
    expect(parseToYmd(new Date('2008-11-03T03:59:59'), HMS_FORMAT.H)).toBe('2008/11/03  03')
  })
  test('yyyy/mm/dd hh:mm', () => {
    expect(parseToYmd(new Date('2017-4-21 16:2:57'), HMS_FORMAT.HM)).toBe('2017/04/21  16:02')
  })
  test('yyyy/mm/dd hh:mm:ss', () => {
    expect(parseToYmd(new Date('2010/9/7 11:20:7'), HMS_FORMAT.HMS)).toBe('2010/09/07  11:20:07')
  })
  test('Invalid Date', () => {
    expect(parseToYmd(new Date('2010/19/7 11:20:7'))).toBe('Invalid Date')
  })
})

describe('dateUtil.parseSecToHMS', () => {
  test('seconds greater than 2 hours', () => {
    expect(parseSecToHMS(15487)).toBe('04:18:07')
  })
  test('seconds greater than sixty', () => {
    expect(parseSecToHMS(677)).toBe('00:11:17')
  })
  test('seconds less than sixty', () => {
    expect(parseSecToHMS(19)).toBe('00:00:19')
  })
  test('float number greater than sixty', () => {
    expect(parseSecToHMS(63.8787103)).toBe('00:01:04')
  })
  test('zero case', () => {
    expect(parseSecToHMS(0)).toBe('00:00:00')
  })
  test('negative number', () => {
    expect(parseSecToHMS(-6.31488)).toBe('00:00:00')
  })
})

describe('dateUtil.getDateInfo', () => {
  test('seconds greater than 2 hours', () => {
    expect(getDateInfo(new Date('2008-11-03T03:59:59'))).toStrictEqual({
      year: 2008,
      month: 11,
      day: 3,
      hour: 3,
      minute: 59,
      second: 59,
    })
  })
  test('Invalid Date', () => {
    expect(getDateInfo(new Date('2010/19/7 11:20:7'))).toStrictEqual({
      year: 0,
      month: 0,
      day: 0,
      hour: 0,
      minute: 0,
      second: 0,
    })
  })
})

describe('dateUtil.addDays', () => {
  test('add three days', () => {
    expect(addDays(new Date('2017-04-21 16:02:57'), 3)).toStrictEqual(
      new Date('2017-04-24 16:02:57'),
    )
  })
})

describe('dateUtil.getStartDay', () => {
  test('normal case', () => {
    expect(getStartDay(new Date('2017-04-21 16:02:57'))).toStrictEqual(
      new Date('2017-04-21 00:00:00'),
    )
  })
})

describe('dateUtil.getDiffDays', () => {
  test('normal case', () => {
    expect(getDiffDays(new Date('2017-04-21 16:02:57'), new Date('2017-05-11 16:02:57'))).toBe(21)
  })
})

describe('dateUtil.fixZero', () => {
  test('digits case', () => {
    expect(fixZero(7)).toBe('07')
  })
  test('tens case', () => {
    expect(fixZero(24)).toBe('24')
  })
})
