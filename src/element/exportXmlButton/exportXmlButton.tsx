import localforage from 'localforage'
import React, { useEffect, useState } from 'react'
import { Container } from 'typescript-ioc'
import { ICommandData, IGroupCommandDetail } from '../../data/commandData'
import { StringBuilder } from '../../data/stringBuilder'
import { CommandType, GroupType } from '../../mainConfig'
import { DataModel } from '../..//model/dataModel'
import { Common } from '../../util/common'

enum ButtonState {
  Active = 'active',
  Inactive = 'inactive'
}

interface IExportXmlButtonProps {
  className: string
  id: string
}

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

const nextGroupCommandPromise = (xmlContentSB: StringBuilder, groupList: string[]) => {
  return new Promise<void>(resolve => {
    localforage.getItem(groupList[0] + '-command').then((commandData) => {
      localforage.getItem(groupList[0] + '-detail').then((groupData) => {
        let groupTagStr = Common.EmptyString
        const groupStartIndex = (groupData as IGroupCommandDetail)?.startIndex
        if (groupStartIndex != null) {
          groupTagStr = ` markLine="${groupStartIndex + 1}"`
        }
        xmlContentSB.append(`  <${groupList[0]}${groupTagStr}>`)
        if (commandData) {
          const commands = commandData as ICommandData[]
          commands.forEach((command, index) => {
            const sqlTagStr = `startLine="${command.startIndex + 1}" endLine="${command.endIndex + 1}"`
            const sqlCommandStr = `    <SQL sql_idx="${index + 1}" ${sqlTagStr}>\n${escapeXml((command.content as any)._strings.join('\r\n'))}</SQL>`
            xmlContentSB.append(sqlCommandStr)
          })
        }
        xmlContentSB.append(`  </${groupList[0]}>`)
        groupList = groupList.slice(1)
        if (groupList.length > 0) {
          nextGroupCommandPromise(xmlContentSB, groupList).then(() => resolve())
        } else {
          resolve()
        }
      })
    })
  })
}

export const ExportXmlButton: React.FC<IExportXmlButtonProps> = ({ className, id }) => {
  const dataModel = Container.get(DataModel)
  const [isCommandValid, setCommandValid] = useState(dataModel.getCommandValid(dataModel.currentTab))

  const handleOnClick = () => {
    if (!dataModel.getCommandValid(dataModel.currentTab)) {
      return
    }
    dataModel.onStartLoadSignal.dispatch()

    const xmlContentSB = new StringBuilder()
    xmlContentSB.append('<?xml version="1.0" encoding="UTF-8"?>')
    xmlContentSB.append('<SQLBodys>')

    const groupList = Object.values(GroupType)

    nextGroupCommandPromise(xmlContentSB, groupList).then(() => {
      xmlContentSB.append('</SQLBodys>')
      const blob = new Blob([xmlContentSB.toString('\r\n')], { type: 'text/xml' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = dataModel.fileName.replace(/.sql$/, '.xml')
      a.click()
      dataModel.onCompleteLoadSignal.dispatch()
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
    <button className={className + ' ' + (isCommandValid ? ButtonState.Active : ButtonState.Inactive)} id={id} onClick={handleOnClick}>Export as XML</button>
  )
}
