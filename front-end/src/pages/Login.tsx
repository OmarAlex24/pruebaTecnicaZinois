import LoginForm from "@/components/LoginForm";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Login = () => {
  return (
    <div className="h-svh flex flex-col items-center justify-center">
      <div className="min-w-96">
        <Card className="min-w-72 max-w-96">
          <CardHeader>
            <CardTitle>Registrarse</CardTitle>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
