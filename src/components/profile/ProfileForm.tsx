import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "./types";

interface ProfileFormFieldsProps {
  form: UseFormReturn<ProfileFormValues>;
}

export const ProfileFormFields = ({ form }: ProfileFormFieldsProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-blue-600">Username</FormLabel>
            <FormControl>
              <Input 
                placeholder="Choose a unique username..." 
                className="bg-gray-50 border-gray-200 text-black" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-blue-600">First Name</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter here..." 
                className="bg-gray-50 border-gray-200 text-black" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-blue-600">Last Name</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter here..." 
                className="bg-gray-50 border-gray-200 text-black" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="birthdate"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-blue-600">Birthdate</FormLabel>
            <FormControl>
              <Input
                type="date"
                placeholder="Enter here (mm/dd/yyyy)"
                className="bg-gray-50 border-gray-200 text-black"
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