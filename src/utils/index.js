function formatNumber(n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('-')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

export function uuid() {
  const mydate = new Date();
  const uuid = "cfh"+mydate.getDay()+ mydate.getHours()+ mydate.getMinutes()+mydate.getSeconds()+mydate.getMilliseconds()+ Math.round(Math.random() * 10000);
  return uuid;
}

export function numFormat(num, flag = '') {
  num = +num;
  if (isNaN(num)) return 0;
  if (!flag) return num;
  const newFlag = flag.toLowerCase();
  if (newFlag == 'k') {
    if (num < 1000) {
      return num;
    } else {
      return parseInt((num / 1000) * 10) / 10 + flag + '+';
    }
  }
  if (newFlag == 'w') {
    if (num < 10000) {
      return num;
    } else {
      return parseInt((num / 10000) * 10) / 10 + flag + '+';
    }
  }
}

export function checkSession() {
  return new Promise((resolve, reject) => {
    mpvue.checkSession({
      success() {
        resolve(false);
      },
      fail() {
        resolve(true);
      }
    });
  });
}
