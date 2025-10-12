import React from "react";
import { useTranslation } from "react-i18next";

const PriceBoard: React.FC = () => {
  const { t } = useTranslation();
  return <div>{t("PriceBoard.Bảng giá")}</div>;
};

export default PriceBoard;
