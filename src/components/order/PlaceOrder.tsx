import React from "react";
import { useTranslation } from "react-i18next";

const PlaceOrder: React.FC = () => {
  const { t } = useTranslation();
  return <div>{t("Order.Đặt lệnh")}</div>;
};

export default PlaceOrder;
