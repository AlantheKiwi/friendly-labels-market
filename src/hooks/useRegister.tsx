
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const { toast } = useToast();

  const registerUser = async (
    email: string, 
    password: string, 
    firstName: string,
    lastName: string,
    company: string,
    phone: string
  ) => {
    setIsLoading(true);
    
    try {
      // First, sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            company,
            phone
          }
        }
      });
      
      if (error) {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      // Then, if successful, assign the client role
      if (data.user) {
        console.log("Assigning client role to user:", data.user.id);
        
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert([{ user_id: data.user.id, role: "client" }]);
        
        if (roleError) {
          console.error("Error assigning client role:", roleError);
          toast({
            title: "Warning",
            description: "Account created but role assignment failed. Please contact support.",
            variant: "destructive"
          });
        } else {
          console.log("Client role assigned successfully");
        }
      }
      
      // Show success screen
      setRegistrationComplete(true);
      setIsLoading(false);
      
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    registrationComplete,
    registerUser
  };
}
