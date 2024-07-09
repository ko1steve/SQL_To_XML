import React from 'react'
import DescriptionItems from './itemList'

const Description: React.FC = () => {
  const items = [
    '在五大區塊語法第一行放置下列對應的特殊字串,讓程式做辨識擷取SQL語法。\n(1) 前置語法:--#PreSQL\n(2) PreProd前置語法:--#PreProdSQL\n(3) Count語法:--#CountSQL\n(4) 異動前/後語法:--#SelectSQL\n(5) 異動語法:--#MainSQL\n(6) 後置語法:--#PostSQL',
    '統一在 SQL 檔每一段 SQL 指令的前一行放置特殊字串「/*--!*/」,讓程式做辨識截取SQL語法。',
    'SQL檔案內容需至少有以下的內容才視為完整的SQL檔案\n(1) DML須至少有Count語法、異動前/後語法、異動語法\n(2) DDL須至少有異動語法',
    'DML語法結尾的分號(;)將會被 Dimensions 自動註解化',
    '不能使用單行的 GO, COMMIT 語法，也不能使用純註解或只含空白字元的字串',
    '不得在 DDL 指令內部以外的情境使用 GO, COMMIT 語法。若是有以上語法，則會在 Dimensions 自動被註解化'
  ]
  return (
    <div className='col-4 container' id='descript-container'>
      <div>
        <p className='h2 d-flex justify-content-center' id='description-title'>格式說明</p>
      </div>
      <div className='d-flex justify-content-center' id='description-content'>
        <DescriptionItems items={items} />
      </div>
    </div>
  )
}

export default Description
