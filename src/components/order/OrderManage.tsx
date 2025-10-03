import React from "react";
import { useTranslation } from "react-i18next";

const OrderManage: React.FC = () => {
  const { t } = useTranslation();
  return <div>{t("Order.Quản lý đặt lệnh")}</div>;
};

export default OrderManage;
