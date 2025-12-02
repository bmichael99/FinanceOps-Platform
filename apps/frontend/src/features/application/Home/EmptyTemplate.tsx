import React from 'react'
import { IconFolderCode } from "@tabler/icons-react"
import { ArrowUpRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { useNavigate } from 'react-router-dom'
type Props = {
  title: string,
  description: string,
  leftButton: {
    content: string,
    url: string,
  },
  rightButton: {
    content: string,
    url: string,
  },
}

function EmptyTemplate({title, description, leftButton, rightButton}: Props) {
  const navigate = useNavigate();
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconFolderCode />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>
          {description}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button onClick={async () => await navigate(leftButton.url)}>{leftButton.content}</Button>
          <Button variant="outline" onClick={async () => await navigate(rightButton.url)}>{rightButton.content}</Button>
        </div>
      </EmptyContent>
      <Button
        variant="link"
        asChild
        className="text-muted-foreground"
        size="sm"
      >
        <a href="#">
          Learn More <ArrowUpRightIcon />
        </a>
      </Button>
    </Empty>
  )
}

export default EmptyTemplate