interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
    return <div className="flex justify-center pt-20">{children}</div>
};

export default AuthLayout;