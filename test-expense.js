// Simple test to check if expense addition works
const testExpense = async () => {
  try {
    console.log('Step 1: Logging in...');
    
    const loginResponse = await fetch('http://localhost:8000/api/v1/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpassword123'
      })
    });
    
    console.log('Login status:', loginResponse.status);
    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);
    
    if (loginResponse.ok) {
      console.log('\nStep 2: Adding expense...');
      
      const expenseResponse = await fetch('http://localhost:8000/api/v1/expence/addexpence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          description: 'Test Expense from Script',
          amount: 50,
          category: 'Food',
          currency: 'USD'
        })
      });
      
      console.log('Expense status:', expenseResponse.status);
      const expenseData = await expenseResponse.json();
      console.log('Expense response:', expenseData);
      
      if (expenseResponse.ok) {
        console.log('✅ SUCCESS! Expense added!');
      } else {
        console.log('❌ FAILED! Error:', expenseData.error);
      }
    }
  } catch (error) {
    console.error('Test error:', error);
  }
};

testExpense();
