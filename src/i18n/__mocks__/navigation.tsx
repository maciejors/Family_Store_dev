export const useRouter = jest.fn();

export const Link = ({ children, ...props }) => <a {...props}>{children}</a>;
