import React from 'react'
import {type InvoiceTableData} from "@finance-platform/types"
import {type ColumnDef} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, ArrowUpDown, SquareArrowOutUpRight } from "lucide-react"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import useFetchPrivate from '@/hooks/useFetchPrivate'
import { useNavigate } from 'react-router-dom'

type useBrowseInvoiceColumnsType = {
  setInvoiceTableData: React.Dispatch<React.SetStateAction<InvoiceTableData[] | undefined>>
}

export function useBrowseInvoiceColumns({setInvoiceTableData} : useBrowseInvoiceColumnsType){
  const fetchPrivate = useFetchPrivate();
  const navigate = useNavigate();
  const thirtyDaysInMilliseconds = 30*24*60*60*1000;
  const currentTime = new Date().getTime();

  async function deleteInvoice(invoice: InvoiceTableData){
    if(!window.confirm(`Are you sure you want to delete Invoice ${invoice.originalFileName} with ID ${invoice.InvoiceId}?`))
      return;
    //optimistic UI update with restoration on API failure.
    const {fileName} = invoice;
    setInvoiceTableData((invoices) => invoices?.filter((invoice) => invoice.fileName != fileName))

    const response = await fetchPrivate({endpoint:`/invoices/${fileName}`, method:"delete"});
    if(response.ok){
      toast.success(`Successfully deleted invoice ${invoice.InvoiceId}`)
    } else {
      toast.error(`Failed to delete invoice ${invoice.InvoiceId}`)
      setInvoiceTableData((invoices) => {return invoices ? [...invoices, invoice] : [invoice]})
    }
  }

  function isWithin30Days(date: Date) : boolean{
    if((currentTime - date.getTime()) <= thirtyDaysInMilliseconds){
      return true;
    }
    return false;
  }

  const columns: ColumnDef<InvoiceTableData>[] = [
    {
      accessorKey: "OpenFile",
      header: "",
      cell: ({row}) => {
        return (
          <Tooltip>
            <TooltipTrigger>
              <Button variant='ghost' onClick={async () => await navigate(`${row.original.fileName}`)}><SquareArrowOutUpRight /></Button>
            </TooltipTrigger>
            <TooltipContent>
              View/Edit Invoice
            </TooltipContent>
          </Tooltip>
        )
      }
    },
    {
      accessorKey: "InvoiceTotal",
      // header: () => <div className="text-right">Invoice Amount</div>,
      header: ({ column }) => {
        return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Invoice Total
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
      },
      cell: ({row}) => {
        const amount = row.original.InvoiceTotal && row.original.InvoiceTotal;
        const formatted = amount && new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
        return (
        <div className='pl-3 font-medium flex items-center'>
          {formatted}
        </div>
        )
      }
    },
    {
      accessorKey: "InvoiceId",
      header: "Invoice No.",
      cell: ({row}) => {
        return (
        <div className=''>
          {row.original.InvoiceId}
        </div>
        )
      },
    },
    {
      accessorKey: "originalFileName",
      header: "File name",
      cell: ({row}) => {
        return (
        <div className=''>
          {row.original.originalFileName.slice(0,35) + (row.original.originalFileName.length > 35 ? "..." : "")}
        </div>
        )
      },
    },
    {
      accessorKey: "InvoiceDate",
      header: ({ column }) => {
        return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className='text-right'
            >
              Invoice Date
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
      },
      cell: ({row}) => {
        return (
        <div className='pl-3'>
          {row.original.InvoiceDate ? new Date(row.original.InvoiceDate).toDateString() : "N/A"}
        </div>
        )
      }
    },
    {
      accessorKey: "DueDate",
      header: ({ column }) => {
        return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className='text-right'
            >
              Due Date
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
      },
      cell: ({row}) => {
        return (
        <div className={(row.original.DueDate && isWithin30Days(new Date(row.original.DueDate))) ? 'pl-3 text-red-600' : 'pl-3'} >
          {row.original.DueDate ? new Date(row.original.DueDate).toDateString() : "N/A"}
        </div>
        )
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const invoice = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={async () => await copyText(invoice)}
              >
                Copy Invoice ID
              </DropdownMenuItem>
              <DropdownMenuItem variant='destructive' onClick={async () => await deleteInvoice(invoice)}>
                Delete Invoice
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return columns;
}

async function copyText(invoice: InvoiceTableData){
  if(invoice.InvoiceId){
    await navigator.clipboard.writeText(invoice.InvoiceId)
    toast.success(`${invoice.InvoiceId} copied to clipboard.`)
  }
}