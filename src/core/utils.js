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

export const miktarValidator = miktar => {
  if (!miktar) return 'Lütfen miktar girin.';

  return '';
};

export const aciklamaValidator = aciklama => {
  if (!aciklama) return 'Lütfen Açıklama Girin.';

  return '';
};

export const hesapNoValidator = text => {
  if (!text || text.length < 9) return 'Lütfen 9 haneli geçerli hesapno girin.';

  return '';
};

export const hesapEkNoValidator = text => {
  if (!text || text.length < 4) return 'Lütfen 4 haneli geçerli hesapekno girin.';

  return '';
};

export const plakaValidator = text => {
  if (!text) return 'Plaka boş bırakılamaz.';

  var regex, v;
  v = text.replace(/\s+/g, '').toUpperCase();
  regex = /^(0[1-9]|[1-7][0-9]|8[01])(([A-Z])(\d{4,5})|([A-Z]{2})(\d{3,4})|([A-Z]{3})(\d{2}))$/;
  if (v.match(regex) == null) return 'Geçerli bir plaka girin!';
/*
  const re = /^(0[1–9]|[1–7][0–9]|8[01])(([a-zA-Z])(\d{4,5})|([a-zA-Z]{2})(\d{3,4})|([a-zA-Z]{3})(\d{2,3}))$/;
  if (!re.test(text)) return 'Geçerli bir plaka girin!';
*/
  return '';

};

export const krediMiktarValidator = miktar => {
  if (!miktar) return 'Lütfen kredi miktarı girin.';

  return '';
};

export const yasValidator = yas => {
  if (!yas) return 'Lütfen yaş girin.';

  return '';
};

export const aldigiKrediSayisiValidator = sayisi => {
  if (!sayisi) return 'Lütfen daha önce aldığınız kredi sayısını girin.';

  return '';
};