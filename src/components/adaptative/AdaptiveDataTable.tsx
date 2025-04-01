import React from 'react';
import { useDeviceType } from '@/hooks/use-device-type';
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';

interface DataItem {
  id: string | number;
  [key: string]: any;
}

interface Column {
  accessorKey: string;
  header: string;
  cell?: (info: { row: { original: any } }) => React.ReactNode;
}

interface AdaptiveDataTableProps<T extends DataItem> {
  data: T[];
  columns: Column[];
  title?: string;
  description?: string;
}

export function AdaptiveDataTable<T extends DataItem>({ 
  data,
  columns,
  title,
  description
}: AdaptiveDataTableProps<T>) {
  const { isMobile } = useDeviceType();
  
  if (isMobile) {
    return (
      <div className="space-y-4">
        {title && <h2 className="text-xl font-bold">{title}</h2>}
        {description && <p className="text-muted-foreground">{description}</p>}
        
        {data.map((item) => (
          <Card key={item.id} className="mb-4">
            <CardHeader>
              <CardTitle>{item[columns[0].accessorKey] || item.id}</CardTitle>
              {columns[1] && (
                <CardDescription>{item[columns[1].accessorKey]}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                {columns.slice(2).map((column) => (
                  <div key={column.accessorKey} className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">{column.header}:</dt>
                    <dd>
                      {column.cell 
                        ? column.cell({ row: { original: item } }) 
                        : item[column.accessorKey]}
                    </dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  return (
    <div>
      {title && <h2 className="text-xl font-bold mb-2">{title}</h2>}
      {description && <p className="text-muted-foreground mb-4">{description}</p>}
      
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.accessorKey}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              {columns.map((column) => (
                <TableCell key={`${row.id}-${column.accessorKey}`}>
                  {column.cell 
                    ? column.cell({ row: { original: row } }) 
                    : row[column.accessorKey]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
