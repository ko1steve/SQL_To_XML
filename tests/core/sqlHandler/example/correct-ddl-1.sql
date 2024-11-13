--#PreSQL

--#PreProdSQL

--#CountSQL

--#SelectSQL

--#MainSQL
/*--!*/
--CREATE TABLE
CREATE TABLE BUS.TEST_MTPASS_DIFFSUBSIDY_TICKET
(
  UNI_ID                                  CHAR(6)                                  , --堃定期票類別
  SETT_DATE_S                             DATE                                     , --清分日期(起)
  SETT_DATE_E                             DATE                                     , --清分日期(訖)
  CDATE                                  DATE                                       --資料建立日期
)
TABLESPACE BUS_TAB03;

--#PostSQL
/*--!*/
DROP TABLE #BUSTEST_MTPASS_DIFFSUBSIDY_TICKET
