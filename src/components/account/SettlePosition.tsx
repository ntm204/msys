import React from "react";
import { useTranslation } from "react-i18next";

const SettlePosition: React.FC = () => {
  const { t } = useTranslation();
  return <div>{t("Header.Trạng thái tất toán")}</div>;
};

export default SettlePosition;
