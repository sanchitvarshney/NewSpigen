// src/utils/transform.ts

export const transformCustomerData = (data: any[]) => {
  return data?.map((item) => ({
    label: item?.name,
    value: item?.code,
  }));
};

export const transformOptionData = (data: any[]) => {
  return data?.map((item) => ({
    label: item?.text,
    value: item?.id,
  }));
};
export const transformPlaceData = (data: any[]) => {
  return data?.map((item) => ({
    label: item?.name,
    value: item?.code.toString(),
  }));
};

export const transformClientTds = (data: any[]) => {
  return data?.map((item) => ({
    label: item?.tds_name,
    value: item?.tds_key,
  }));
};
export const transformClientData = (data: any[]) => {
  return data?.map((item) => ({
    label: item?.label,
    value: item?.addressID,
  }));
};

export const transformCurrencyData = (data: any[]) => {
  return data?.map((item) => ({
    label: item?.currency_symbol,
    value: item?.currency_id,
  }));
};

export const transformUomData = (data: any[]) => {
  return data?.map((item) => ({
    label: item?.units_name,
    value: item?.units_id,
  }));
};