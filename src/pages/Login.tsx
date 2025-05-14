import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import useAuth from '@/hooks/useAuth';

const loginFormSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    // For demo purposes, we'll just check if the email and password match a test account
    if (data.email === 'demo@example.com' && data.password === 'password123') {
      // Use the login function from auth context
      login(data.email);
      
      toast({
        title: 'Login bem-sucedido',
        description: 'Bem-vindo ao Obra Alerta Maps!',
      });
      
      // Redirect to filter page after successful login
      navigate('/filter'); // MODIFIED: Redirect to /filter
    } else {
      toast({
        title: 'Falha no login',
        description: 'Email ou senha incorretos. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Obra Alerta Maps</CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="seu@email.com" 
                          className="pl-10" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type={showPassword ? 'text' : 'password'} 
                          placeholder="••••••••" 
                          className="pl-10" 
                          {...field} 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-10 w-10"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </form>
          </Form>
          
          <div className="mt-4 text-center text-sm">
            <p className="text-muted-foreground">
              Credenciais de demonstração: <br />
              Email: demo@example.com <br />
              Senha: password123
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Obra Alerta Maps. Todos os direitos reservados.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;

