
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
      console.log("Starting registration process for:", email);
      
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
        console.error("Registration error:", error);
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
        console.log("User created successfully with ID:", data.user.id);
        
        try {
          console.log("Assigning client role to user:", data.user.id);
          
          // Call the fixed RPC function to assign client role
          const { error: roleError, data: roleData } = await supabase
            .rpc('assign_client_role', { user_id: data.user.id });
          
          console.log("Role assignment response:", roleData);
          
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
        } catch (roleError) {
          console.error("Exception during role assignment:", roleError);
          toast({
            title: "Warning",
            description: "Account created but role assignment encountered an error. Please contact support.",
            variant: "destructive"
          });
        }
      }
      
      // Show success screen regardless of role assignment
      // The user will have an account, even if role assignment failed
      setRegistrationComplete(true);
      setIsLoading(false);
      
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully.",
      });
      
    } catch (error) {
      console.error("Unexpected registration error:", error);
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
