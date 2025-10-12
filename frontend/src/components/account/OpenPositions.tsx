import React from "react";
import { useTranslation } from "react-i18next";

const OpenPositions: React.FC = () => {
  const { t } = useTranslation();
  return <div>{t("Header.Trạng thái mở")}</div>;
};

export default OpenPositions;
