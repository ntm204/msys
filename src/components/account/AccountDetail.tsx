import React from "react";
import { useTranslation } from "react-i18next";

const AccountDetail: React.FC = () => {
  const { t } = useTranslation();
  return <div>{t("Header.Chi tiết tài khoản")}</div>;
};

export default AccountDetail;
