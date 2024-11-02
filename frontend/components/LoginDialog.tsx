import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from 'next/navigation';

interface LoginDialogProps {
    onClose: () => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ onClose }) => {
    const router = useRouter(); // Initialize router for navigation

    const handleLoginRedirect = () => {
        router.push('/login'); // Redirect to the login page
        onClose(); // Close the dialog after redirect
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Login Required</DialogTitle>
                    <DialogDescription>
                        You need to log in to add items to your wishlist.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={handleLoginRedirect}>
                        Go to Login
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default LoginDialog;
