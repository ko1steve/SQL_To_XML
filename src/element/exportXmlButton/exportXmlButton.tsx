import localforage from 'localforage'
import React, { useEffect, useState } from 'react'
import { CommandData, StringBuilder } from 'src/config/commandData'
import { CommandType, GroupType } from 'src/mainConfig'
import { DataModel } from 'src/model/dataModel'
import { Container } from 'typescript-ioc'

enum ButtonState {
  Active = 'active',
  Inactive = 'inactive'
}

export const ExportXmlButton: React.FC = () => {
  const dataModel = Container.get(DataModel)
  const [isCommandValid, setCommandValid] = useState<boolean>(dataModel.getCommandValid(dataModel.currentTab))

  const escapeXml = (unsafe: string) => {
    return unsafe.replace(/[<>&'"]/g, function (c) {
      switch (c) {
        case '<': return '&lt;'
        case '>': return '&gt;'
        case '&': return '&amp;'
        case '\'': return '&apos;'
        case '"': return '&quot;'
        default: return c
      }
    })
  }

  const handleOnClick = () => {
    if (!dataModel.getCommandValid(dataModel.currentTab)) {
      return
    }
    const overlay = document.getElementById('overlay') as HTMLDivElement
    overlay.style.display = 'flex'

    const xmlContentSB = new StringBuilder()
    xmlContentSB.append('<?xml version="1.0" encoding="UTF-8"?>')
    xmlContentSB.append('<SQLBodys>')

    const promiseList: Promise<void>[] = []
    Object.values(GroupType).forEach(groupName => {
      const promise = new Promise<void>(resolve => {
        localforage.getItem(groupName + '-command').then((data) => {
          xmlContentSB.append('  <' + groupName + '>')
          if (!data) {
            xmlContentSB.append('  </' + groupName + '>')
            return resolve()
          }
          const commands = data as CommandData[]
          commands.forEach((command, index) => {
            let sqlCommandStr = '    <SQL sql_idx="' + (index + 1) + '">'
            //* 需透過編碼轉換 XML 跳脫字元
            sqlCommandStr += escapeXml(command.content.toString()) + '</SQL>'
            xmlContentSB.append(sqlCommandStr)
          })
          xmlContentSB.append('  </' + groupName + '>')
          resolve()
        })
      })
      promiseList.push(promise)
    })
    Promise.all(promiseList).then(() => {
      xmlContentSB.append('</SQLBodys>')
      const blob = new Blob([xmlContentSB.toString('\r\n')], { type: 'text/xml' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = dataModel.fileName.replace(/.sql$/, '.xml')
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      overlay.style.display = 'none'
    })
  }

  useEffect(() => {
    const onCommandValidChange = (data: { commandType: CommandType, isValid: boolean }) => {
      setCommandValid(data.isValid)
    }
    const onTabChange = (commandType: CommandType) => {
      setCommandValid(dataModel.getCommandValid(commandType))
    }
    const onCommandValidChangeBinding = dataModel.onCommandValidChangeSignal.add(onCommandValidChange)
    const onTabChangeBinding = dataModel.onTabChangeSignal.add(onTabChange)
    return () => {
      dataModel.onCommandValidChangeSignal.detach(onCommandValidChangeBinding)
      dataModel.onTabChangeSignal.detach(onTabChangeBinding)
    }
  }, [])

  return (
    <div className='download-button-container'>
      <button id='download-button' className={`${(isCommandValid ? ButtonState.Active : ButtonState.Inactive)}`} onClick={handleOnClick}>Export as XML</button>
    </div>
  )
}
