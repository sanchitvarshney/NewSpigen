import React from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store"; // Import the type for your AppDispatch
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ReusableTable from "@/components/shared/ReusableTable";
import { transformUomTable } from "@/helper/TableTransformation";
import { useToast } from "@/components/ui/use-toast";
import { InputStyle, LableStyle } from "@/constants/themeContants";
import { Textarea } from "@/components/ui/textarea";
import { createProduct } from "@/features/product/productSlice";

const schema = z.object({

  unit: z.string({ required_error: "Unit is required" }),
  specification:z.string({ required_error: "Specification is required" }),
});

const UomPage: React.FC = () => {
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      const resultAction = await dispatch(
        createProduct({
          endpoint: "/uom/insert",
          payload: {
           uom:values.unit,
           description:values.specification
          },
        })
      ).unwrap();

      if (resultAction.code === 200) {
        toast({
          title:
            typeof resultAction.message === "string"
              ? resultAction.message
              : JSON.stringify(resultAction.message),
          className: "bg-green-600 text-white items-center",
        });
      } else {
        toast({
          title:
            typeof resultAction.message === "string"
              ? resultAction.message
              : JSON.stringify(resultAction.message),
          className: "bg-red-600 text-white items-center",
        });
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const columnDefs: any[] = [
    {
      headerName: "#",
      field: "id",
      valueGetter: "node.rowIndex + 1",
      // sortable: true,
      // filter: true,
      width: 50,
    },
    {
      headerName: "Unit",
      field: "unit",
      sortable: true,
      filter: true,
      minWidth: 400,
    },
    {
      headerName: "Specification",
      field: "specification",
      sortable: true,
      filter: true,
      minWidth: 400,
    },

  ];

  return (
    <div className="h-[calc(100vh-100px)] bg-[#fff] grid grid-cols-[450px_1fr]">
      <div>
        <Card className="border-none shadow-none rounded-0">
          <CardHeader className="p-0 bg-hbg h-[49px] border-b border-slate-300 px-[10px] flex justify-center">
            <CardTitle className="text-slate-600 font-[500]">
              Create UOM
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8 flex flex-col gap-[20px] mt-[20px]"
                >
                 
                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={LableStyle}>
                          Unit
                          <span className="pl-1 text-red-500 font-bold">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Product Name"
                            {...field}
                            className={InputStyle}
                             />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                 
                 <div className="mt-[40px]">
                    <FormField
                      control={form.control}
                      name="specification"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={LableStyle}>
                            Specification
                            <span className="pl-1 text-red-500 font-bold">
                              *
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              className={InputStyle}
                              placeholder="Specification"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* <p>error message</p> */}
                  </div>

                  <div>
                    <Button
                      type="submit"
                      className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
                    >
                      Submit
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="h-[calc(100vh-100px)]">
        <ReusableTable
          heigth="h-[calc(100vh-100px)]"
          endpoint="uom"
          columns={columnDefs}
          transform={transformUomTable}
          method="get"
        />
      </div>
    </div>
  );
};

export default UomPage;
