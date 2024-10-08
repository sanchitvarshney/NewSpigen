import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Edit2 } from "lucide-react";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Select from "react-select";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import { Textarea } from "@/components/ui/textarea";
import {
  InputStyle,
  LableStyle,
  modelFixFooterStyle,
  modelFixHeaderStyle,
} from "@/constants/themeContants";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  // fetchImageProduct,
  getProductForUpdate,
  updateProduct,
  // uploadProductImages,
} from "@/features/product/productSlice";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useToast } from "@/components/ui/use-toast";
import { transformUomData } from "@/helper/transform";
import FullPageLoading from "@/components/shared/FullPageLoading";

const productSchema = z.object({
  productname: z.string().optional(),
  uom: z.string().optional(),
  productcategory: z.string().optional(),
  category: z.string().optional(),
  mrp: z.string().optional(),
  producttype: z.string().optional(),
  isenabled: z.string().optional(),
  description: z.string().optional(),
  gsttype: z.string().optional(),
  gstrate: z.string().optional(),
  asin: z.string({ required_error: "Asin is required" }),
  fnsku: z.string({ required_error: "Fnsku is required" }),
  item_code: z.string({ required_error: "Item code is required" }),
  fsnid: z.string({ required_error: "Fsnid is required" }),
  croma_code: z.string({ required_error: "Croma code is required" }),
  hsn: z.string().optional(),
  brand: z.string().optional(),
  ean: z.string().optional(),
  weight: z.string().optional(),
  vweight: z.string().optional(),
  height: z.string().optional(),
  width: z.string().optional(),
  minstockrm: z.string().optional(),
  minstock: z.string().optional(),
  mfgBatchSize: z.string().optional(),
  location: z.string().optional(),
  labourcost: z.string().optional(),
  packingcost: z.string().optional(),
  jobworkcost: z.string().optional(),
  othercost: z.string().optional(),
  batchstock: z.string().optional(),
  caption: z.string().optional(),
});

const ProductActionCellRender = (params: any) => {
  const { product_key } = params.params.data;
  // const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  // const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const productData = useSelector(
    (state: RootState) =>
      state.prod.data.find((prod: any) => prod?.pKey === product_key) || {}
  );

  // const uom:any = useSelector((state: RootState) => state.prod.uom.data);
  const { loading, uom } = useSelector((state: RootState) => state.prod);

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productname: "",
      caption: "",
    },
  });

  useEffect(() => {
    if (productData && productData.pKey === product_key) {
      form.reset({
        // pKey: productData.pKey,
        // sku: productData.sku,
        productname: productData.productname,
        uom: productData.uomid,
        // uomid: productData.uomid,
        category: productData.productcategory,
        mrp: productData.mrp,
        producttype: productData.producttype_name,
        // costprice: productData.costprice,
        asin: productData.asin,
        fnsku: productData.fnsku,
        item_code: productData.item_code,
        fsnid: productData.fsnid,
        croma_code: productData.croma_code,
        isenabled: productData.enablestatus_name,
        gsttype: productData.tax_type_name,
        gstrate: productData.gstrate_name,
        hsn: productData.hsncode,
        brand: productData.brand,
        ean: productData.ean,
        weight: productData.weight,
        vweight: productData.vweight,
        height: productData.height,
        width: productData.width,
        // url: productData.url,
        // loc: productData.loc,
        labourcost: productData.laboutcost,
        packingcost: productData.packingcost,
        othercost: productData.othercost,
        jobworkcost: productData.jobworkcost,
        minstock: productData.minstock,
        minstockrm: productData.minrmstock,
        batchstock: productData.batchstock,
        location: productData.loc,
        description: productData.description,

        // description: productData.description,
      });
    }
  }, [productData]);

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files) {
  //     const files = Array.from(event.target.files);
  //     setSelectedFiles(files);

  //     // Generate preview URLs
  //     const previews = files.map((file) => URL.createObjectURL(file));
  //     setImagePreviews(previews);
  //   }
  // };

  // const uploadImages = async () => {
  //   if (selectedFiles.length > 0) {
  //     const uploadPayload = {
  //       files: selectedFiles,
  //       product: productKey,
  //       caption: form.getValues("caption") || "",
  //     };

  //     try {
  //       const uploadAction = await dispatch(
  //         uploadProductImages(uploadPayload) as any
  //       );

  //       if (uploadProductImages.fulfilled.match(uploadAction)) {
  //         toast({
  //           title: "Images uploaded successfully",
  //           className: "bg-green-600 text-white items-center",
  //         });
  //       } else if (uploadProductImages.rejected.match(uploadAction)) {
  //         toast({
  //           title:
  //             (uploadAction.payload as { message: string })?.message ||
  //             "Failed to upload images",
  //           className: "bg-red-600 text-white items-center",
  //         });
  //       }
  //     } catch (error) {
  //       toast({
  //         title: "An unexpected error occurred",
  //         className: "bg-red-600 text-white items-center",
  //       });
  //     }
  //   } else {
  //     toast({
  //       title: "No images selected",
  //       className: "bg-yellow-600 text-white items-center",
  //     });
  //   }
  // };

  async function onSubmit(value: any) {
    const payload = {
      ...value,

      producttKey: product_key,
      status: value.active ? "active" : "inactive",
    };

    try {
      const action = await dispatch(
        updateProduct({ endpoint: `/products/updateProduct`, payload }) as any
      );

      if (updateProduct.fulfilled.match(action)) {
        setIsSheetOpen(false);
        toast({
          title: "Product updated successfully",
          className: "bg-green-600 text-white items-center",
        });
      } else if (updateProduct.rejected.match(action)) {
        toast({
          title:
            typeof action?.error?.message === "string"
              ? action?.error?.message
              : JSON.stringify(action?.error?.message),
          className: "bg-red-600 text-white items-center",
        });
      }
    } catch (error) {
      // Handle unexpected errors
      toast({
        title: "An unexpected error occurred",
        className: "bg-red-600 text-white items-center",
      });
    }
  }

  return (
    <div className="flex items-center gap-[10px]">
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger>
          <Edit2
            onClick={() => {
              if (product_key) {
                dispatch(
                  getProductForUpdate({ product_key: product_key }) as any
                );
                setIsSheetOpen(true);
              }
            }}
            className="text-cyan-700 h-[20px] w-[20px]"
          />
        </SheetTrigger>
        <SheetContent className="min-w-[60%] p-0">
          {loading && <FullPageLoading />}
          <SheetHeader
            className={modelFixHeaderStyle}
            style={{ padding: "40px" }}
          >
            <SheetTitle>Updating: {productData?.productname}</SheetTitle>
          </SheetHeader>
          <div className=" h-[calc(100vh-50px)]">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="px-[10px] h-[calc(100vh-100px)] py-[20px] overflow-y-auto flex flex-col gap-[20px]">
                  <Card className="border rounded-md shadow-sm">
                    <CardHeader className="h-[50px] p-0 px-[10px] flex justify-center bg-hbg">
                      <CardTitle className="font-[500] text-slate-600">
                        Basic Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="mt-[20px] px-[10px]">
                      <div className="grid grid-cols-3 gap-[30px] items-center ">
                        <FormField
                          control={form.control}
                          name="productname"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={LableStyle}>
                                Product name
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
                        <div>
                          <FormField
                            control={form.control}
                            name="uom"
                            render={() => (
                              <FormItem>
                                <FormLabel className={LableStyle}>
                                  UOM
                                  <span className="pl-1 text-red-500 font-bold">
                                    *
                                  </span>
                                </FormLabel>
                                <FormControl>
                                  <Select
                                    styles={customStyles}
                                    placeholder="UOM"
                                    className="border-0 basic-single"
                                    classNamePrefix="select border-0"
                                    components={{ DropdownIndicator }}
                                    isDisabled={false}
                                    isLoading={false}
                                    isClearable={true}
                                    isSearchable={true}
                                    name="uom"
                                    options={
                                      Array.isArray(uom)
                                        ? transformUomData(uom)
                                        : []
                                    }
                                    onChange={(e: any) => {
                                      form.setValue("uom", e.value);
                                    }}
                                    value={
                                      Array.isArray(uom)
                                        ? transformUomData(uom)?.find(
                                            (state: any) => {
                                              const currentValue =
                                                form.getValues("uom");
                                              return (
                                                state.value === currentValue
                                              );
                                            }
                                          )
                                        : null // Set to null if states is not an array
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="productcategory"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                ProductCategory
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Product Category"
                                  {...field}
                                  className={InputStyle}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="category"
                          render={() => (
                            <FormItem className="flex flex-col w-full">
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                Category
                              </FormLabel>
                              <FormControl>
                                <Select
                                  styles={customStyles}
                                  placeholder="Product Type"
                                  className="border-0 basic-single"
                                  classNamePrefix="select border-0"
                                  components={{ DropdownIndicator }}
                                  isDisabled={false}
                                  isLoading={false}
                                  isClearable={true}
                                  isSearchable={true}
                                  name="color"
                                  options={[
                                    { label: "Goods", value: "good" },
                                    { label: "Services", value: "service" },
                                  ]}
                                  onChange={(value: any) =>
                                    form.setValue("category", value!.value)
                                  }
                                  defaultValue={{
                                    label: "Goods",
                                    value: "good",
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="mrp"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                MRP
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="MRP"
                                  {...field}
                                  className={InputStyle}
                                  readOnly
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="producttype"
                          render={() => (
                            <FormItem className="flex flex-col w-full">
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                Type
                              </FormLabel>
                              <FormControl>
                                <Select
                                  styles={customStyles}
                                  placeholder="Product Type"
                                  className="border-0 basic-single"
                                  classNamePrefix="select border-0"
                                  components={{ DropdownIndicator }}
                                  isDisabled={false}
                                  isLoading={false}
                                  isClearable={true}
                                  isSearchable={true}
                                  name="color"
                                  options={[
                                    { label: "FG", value: "fg" },
                                    { label: "SFG", value: "sfg" },
                                  ]}
                                  onChange={(value: any) =>
                                    form.setValue("producttype", value!.value)
                                  }
                                  defaultValue={{
                                    label: "FG",
                                    value: "fg",
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="isenabled"
                          render={() => (
                            <FormItem className="flex flex-col w-full">
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                Enabled
                              </FormLabel>
                              <FormControl>
                                <Select
                                  styles={customStyles}
                                  placeholder="Enabled"
                                  className="border-0 basic-single"
                                  classNamePrefix="select border-0"
                                  components={{ DropdownIndicator }}
                                  isDisabled={false}
                                  isLoading={false}
                                  isClearable={true}
                                  isSearchable={true}
                                  name="enablestatus_name"
                                  options={[
                                    { label: "Yes", value: "Y" },
                                    { label: "No", value: "N" },
                                  ]}
                                  onChange={(value: any) =>
                                    form.setValue("isenabled", value.value)
                                  }
                                  defaultValue={
                                    productData.enablestatus_name === "Y"
                                      ? { label: "Yes", value: "Y" }
                                      : { label: "No", value: "N" }
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem className="mt-[30px]">
                            <FormLabel className=" text-slate-600 ml-[10px]">
                              Description
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder=""
                                {...field}
                                className=" border-0 border-b rounded-none shadow-none placeholder:text-neutral-500 text-[15px] border-slate-600 focus:outline-none focus:ring-0 focus-visible:ring-0"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                  <Card className="border rounded-md shadow-sm">
                    <CardHeader className="h-[50px] p-0 px-[10px] flex justify-center bg-hbg">
                      <CardTitle className="font-[500] text-slate-600">
                        Other Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="mt-[20px] px-[10px]">
                      <div className="grid grid-cols-3 gap-[30px] items-center ">
                        <FormField
                          control={form.control}
                          name="item_code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                Item Code{" "}
                                <span className="pl-1 text-red-500 font-bold">
                                  *
                                </span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Item Code"
                                  {...field}
                                  className={InputStyle}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="fsnid"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                FSN ID{" "}
                                <span className="pl-1 text-red-500 font-bold">
                                  *
                                </span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="FSN ID"
                                  {...field}
                                  className={InputStyle}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="croma_code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                Croma Code{" "}
                                <span className="pl-1 text-red-500 font-bold">
                                  *
                                </span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Croma Code"
                                  {...field}
                                  className={InputStyle}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="fnsku"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                FNSKU{" "}
                                <span className="pl-1 text-red-500 font-bold">
                                  *
                                </span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="FNSKU"
                                  {...field}
                                  className={InputStyle}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="asin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                ASIN{" "}
                                <span className="pl-1 text-red-500 font-bold">
                                  *
                                </span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="ASIN"
                                  {...field}
                                  className={InputStyle}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border rounded-md shadow-sm">
                    <CardHeader className="h-[50px] p-0 px-[10px] flex justify-center bg-hbg">
                      <CardTitle className="font-[500] text-slate-600">
                        Tax Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="mt-[20px] px-[10px]">
                      <div className="grid grid-cols-3 gap-[30px] items-center ">
                        <FormField
                          control={form.control}
                          name="gsttype"
                          render={() => (
                            <FormItem className="flex flex-col w-full">
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                Tax Type
                              </FormLabel>
                              <FormControl>
                                <Select
                                  styles={customStyles}
                                  placeholder="Tax Type"
                                  className="border-0 basic-single"
                                  classNamePrefix="select border-0"
                                  components={{ DropdownIndicator }}
                                  isDisabled={false}
                                  isLoading={false}
                                  // isClearable={true}
                                  isSearchable={true}
                                  name="color"
                                  options={[
                                    { label: "Exempted", value: "0" },
                                    { label: "Regular", value: "1" },
                                  ]}
                                  onChange={(value: any) =>
                                    form.setValue("gsttype", value!.value)
                                  }
                                  defaultValue={{
                                    label: "Exempted",
                                    value: "0",
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="gstrate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                GST Rate
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="GST Rate"
                                  {...field}
                                  className={InputStyle}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="hsn"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                HSN
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="HSN code"
                                  {...field}
                                  className={InputStyle}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border rounded-md shadow-sm">
                    <CardHeader className="h-[50px] p-0 px-[10px] flex justify-center bg-hbg">
                      <CardTitle className="font-[500] text-slate-600">
                        Advance Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="mt-[20px] px-[10px]">
                      <div className="grid grid-cols-3 gap-[30px] items-center ">
                        <FormField
                          control={form.control}
                          name="brand"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                Brand
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Brand"
                                  {...field}
                                  className={InputStyle}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="ean"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                EAN
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="EAN"
                                  {...field}
                                  className={InputStyle}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="weight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                Weight
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="weight"
                                  {...field}
                                  className={InputStyle}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="vweight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                Volumetric Weight
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Volumetric weight"
                                  {...field}
                                  className={InputStyle}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="height"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                Height
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Height"
                                  {...field}
                                  className={InputStyle}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="width"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                Width
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Width"
                                  {...field}
                                  className={InputStyle}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border rounded-md shadow-sm">
                    <CardHeader className="h-[50px] p-0 px-[10px] flex justify-center bg-hbg">
                      <CardTitle className="font-[500] text-slate-600">
                        Advance Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="mt-[20px] px-[10px]">
                      <div className="grid grid-cols-3 gap-[30px] items-center ">
                        <FormField
                          control={form.control}
                          name="minstockrm"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                MIN Stock (FG)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Min Stock"
                                  {...field}
                                  className={InputStyle}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="minstock"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                MIN Stock(RM)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Min Stock"
                                  {...field}
                                  className={InputStyle}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="mfgBatchSize"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                MFG Batch Size
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="MFG Batch Size"
                                  {...field}
                                  className={InputStyle}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                Default Stock Location
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Default Stock Location"
                                  {...field}
                                  className={InputStyle}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="labourcost"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                Labour Cost
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Labour Cost"
                                  {...field}
                                  className={InputStyle}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="packingcost"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                Sec Packing Cost
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Sec Packing Cost"
                                  {...field}
                                  className={InputStyle}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="jobworkcost"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                JW Cost
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="JW Cost"
                                  {...field}
                                  className={InputStyle}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="othercost"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                Other Cost
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Other Cost"
                                  {...field}
                                  className={InputStyle}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className={modelFixFooterStyle}>
                  <Button
                    type="submit"
                    className="bg-cyan-700 hover:bg-cyan-600"
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </SheetContent>
      </Sheet>
      {/* <Sheet>
        <SheetTrigger>
          <Eye
            className="text-cyan-700 h-[20px] w-[20px]"
            onClick={() => {
              if (productKey) {
                dispatch(fetchImageProduct(productKey) as any);
              }
            }}
            aria-disabled={true}
          />
        </SheetTrigger>
        <SheetContent className="p-0">
          <SheetHeader className={modelFixHeaderStyle}>
            <SheetTitle>{productData?.productname}</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col items-center justify-center h-full">
            <Image className="text-slate-300 h-[50px] w-[50px]" />
            <p className="text-slate-500 mt-[20px]">No image found</p>
          </div>
        </SheetContent>
      </Sheet>
      <Sheet>
        <SheetTrigger>
          <Upload className="text-cyan-700 h-[20px] w-[20px]" />
        </SheetTrigger>
        <SheetContent className="p-0">
          <SheetHeader className={modelFixHeaderStyle}>
            <SheetTitle className="text-slate-600">{productData?.productname}</SheetTitle>
          </SheetHeader>
          <div>
            <div className="mt-[20px] flex flex-col gap-[20px] px-[20px]">
              <Input
                placeholder="caption"
                className="border-slate-400"
                {...form.register("caption")}
              />
              <Label
                htmlFor="image"
                className="flex items-center justify-center border border-dashed border-slate-400 shadow h-[150px] rounded-md flex-col"
              >
                <Upload className="text-slate-300 h-[50px] w-[50px]" />
                <p className="text-slate-500 mt-[20px]">
                  Select images to upload for this product.
                </p>
                <Input
                  id="image"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </Label>
              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-4">
                  {imagePreviews.map((src, index) => (
                    <img
                      key={index}
                      src={src}
                      alt={`Preview ${index + 1}`}
                      className="h-[100px] w-[100px] object-cover rounded-md shadow"
                    />
                  ))}
                </div>
              )}
            </div>
            <div className={modelFixFooterStyle}>
              <Button
                className="bg-cyan-700 hover:bg-cyan-600"
                onClick={uploadImages}
              >
                Upload Images
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet> */}
    </div>
  );
};

export default ProductActionCellRender;
