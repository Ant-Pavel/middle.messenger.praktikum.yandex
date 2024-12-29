

export default {
  first_name: (val: string) => {
    return /^[A-ZА-Я][a-zA-Zа-яА-Я\-]+$/.test(val);
  },
  second_name: (val: string) => {
    return /^[A-ZА-Я][a-zA-Zа-яА-Я\-]+$/.test(val);
  },
  display_name: (val: string) => {
    return /^[A-ZА-Я][a-zA-Zа-яА-Я\-]+$/.test(val);
  },
  login: (val: string) => {
    return val.length >= 3 && val.length <= 20 && (!/^[\d]+$/.test(val)) && (/^[a-zA-Z0-9_\-]+$/.test(val));
  },
  email: (val: string) => {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val);
  },
  password: (val: string) => {
    return val.length >= 8 && val.length <= 40 && /[A-ZА-Я]/.test(val) && /[0-9]/.test(val);
  },
  oldPassword: (val: string) => {
    return val.length >= 8 && val.length <= 40 && /[A-ZА-Я]/.test(val) && /[0-9]/.test(val);
  },
  newPassword: (val: string) => {
    return val.length >= 8 && val.length <= 40 && /[A-ZА-Я]/.test(val) && /[0-9]/.test(val);
  },
  newPasswordCheck: (val: string) => {
    return val.length >= 8 && val.length <= 40 && /[A-ZА-Я]/.test(val) && /[0-9]/.test(val);
  },
  passwordFirst: (val: string) => {
    return val.length >= 8 && val.length <= 40 && /[A-ZА-Я]/.test(val) && /[0-9]/.test(val);
  },
  phone: (val: string) => {
    return val.length >= 10 && val.length <= 15 && (/^\+?[0-9]+$/.test(val));
  },
  message: Boolean,
};
