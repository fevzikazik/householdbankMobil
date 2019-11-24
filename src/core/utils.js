export const emailValidator = email => {
  const re = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0) return 'Eposta boş bırakılamaz.';
  if (!re.test(email)) return 'Geçerli bir Eposta girin!';

  return '';
};

export const passValidator = password => {
  if (!password || password.length != 8) return 'Geçerli 8 haneli şifre girin.';

  return '';
};

export const tcknValidator = tckn => {
  if (!tckn || tckn.length != 11) return '11 haneli TCKN girin.';

  return '';
};

export const adsoyadValidator = adsoyad => {
  if (!adsoyad) return 'Ad Soyad girin.';

  return '';
};

export const telValidator = tel => {
  if (!tel || tel.length != 11) return '11 haneli Telefon girin.(05XX XXX XX XX)';

  return '';
};

export const dogumtarihValidator = dg => {
  if (!dg) return 'Lütfen Doğum Tarihinizi Seçin.';

  return '';
};

export const adresValidator = adres => {
  if (!adres || adres.length < 10) return 'Adres girin.(Min 10 Karakter)';

  return '';
};