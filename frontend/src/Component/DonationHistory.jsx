const DonationHistory = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Fetch the logged-in user info, assuming the user object contains 'role'
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonationData = async () => {
      try {
        console.log("Fetching donation data..."); // Debug log before fetching data
        const data = await fetchDonations();
        console.log("Fetched Donations:", data); // Log the donations to inspect their structure
        
        if (user.role === 'donor') {
          console.log("User is a donor. Filtering donations based on donor's delivered status.");
          // Filter donations made by the donor with "delivered" status
          const donorDonations = data.filter(
            (donation) =>
              donation.Donor?.id === user.id && donation.donor_status.trim().toLowerCase() === "delivered"
          );
          console.log("Filtered Donor Donations:", donorDonations); // Log the filtered donations
          setDonations(donorDonations);
        } else if (user.role === 'ngo') {
          console.log("User is an NGO. Filtering donations based on NGO's picked up status.");
          // Filter donations that the NGO has picked up with "picked up" status
          const ngoDonations = data.filter(
            (donation) =>
              donation.NGO?.id === user.id && donation.ngo_status.trim().toLowerCase() === "picked up"
          );
          console.log("Filtered NGO Donations:", ngoDonations); // Log the filtered donations
          setDonations(ngoDonations);
        }
      } catch (err) {
        console.error("Error fetching donations:", err); // Log the error details
        setError("Error fetching donations. Please try again.");
        handleError(err, "DonationHistory");
      } finally {
        setLoading(false);
      }
    };

    fetchDonationData();
  }, [user]); // Re-fetch data if the user role changes

  if (loading) {
    console.log("Loading donations..."); // Log when the loading state is active
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    console.log("Error occurred while fetching donations."); // Log when there is an error
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (donations.length === 0) {
    console.log("No donations found."); // Log when there are no donations
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">No completed donations found with the specified statuses.</Alert>
      </Container>
    );
  }

  console.log("Rendering donations:", donations); // Log the donations being rendered

  return (
    <Container sx={{ mt: 4 }}>
      {/* 🚀 Improved Header Design */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Donation History
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Track your completed donations
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} /> {/* Adds a subtle line below the header */}
      
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Food Type</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Expiry Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Donor</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>NGO</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Donation Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {donations.map((donation) => (
              <TableRow key={donation.id}>
                <TableCell>{donation.foodType}</TableCell>
                <TableCell>{donation.quantity}</TableCell>
                <TableCell>{new Date(donation.expiryDate).toLocaleDateString()}</TableCell>
                <TableCell>{donation.Donor?.fullname || "Unknown"}</TableCell>
                <TableCell>{donation.NGO?.name || "Unknown NGO"}</TableCell>
                <TableCell>{new Date(donation.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{donation.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default DonationHistory;

