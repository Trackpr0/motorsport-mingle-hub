
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";

interface BusinessProfileFormValues {
  businessName: string;
  avatar?: File;
}

interface BusinessProfileFormFieldsProps {
  form: UseFormReturn<BusinessProfileFormValues>;
}

export const BusinessProfileFormFields = ({ form }: BusinessProfileFormFieldsProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="businessName"
        render={({ field }) => (
          <FormItem className="bg-gray-100 rounded-lg p-4">
            <FormLabel className="text-blue-600 font-medium">Business Name</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter here..." 
                className="bg-white border-gray-200 text-black" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
