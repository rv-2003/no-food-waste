const loginUser = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token); // Store JWT token
        alert("Login Successful!");
      } else {
        alert(data.msg);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  