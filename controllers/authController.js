export const login = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    res.status(200).json({ message: 'Login successful' });
};

export const getUser = (req, res) => {
    const userId = req.params.id;
    const {email, password} = req.body;
    res.status(200).json({ id: userId, name: email });
};
