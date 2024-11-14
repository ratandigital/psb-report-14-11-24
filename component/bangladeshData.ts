type Upazila = string; // Upazilas are represented as strings (names of upazilas)
type District = { [district: string]: Upazila[] }; // Districts are objects with keys being district names and values being arrays of upazilas
type Division = { districts: District }; // Divisions are objects containing a 'districts' field

// Define the type for BangladeshData, which is an object with division names as keys
type BangladeshData = {
  [divisionName: string]: Division;
};

// Your actual data
const bangladeshData: BangladeshData = {
  "Dhaka": {
    districts: {
      "Dhaka": ["Dhanmondi", "Gulshan", "Mirpur", "Uttara", "Motijheel", "Shampur", "Tejgaon", "Kotwali", "Chawk Bazar"],
      "Gazipur": ["Tongi", "Kaliakair", "Kapasia", "Sreepur", "Kaliganj", "Narsingdi"],
      "Narayanganj": ["Narayanganj", "Sonargaon", "Rupganj", "Araihazar", "Bandipur"],
      "Madaripur": ["Madaripur", "Rajoir", "Shibchar", "Kamalnagar"],
      "Munshiganj": ["Munshiganj", "Sreenagar", "Louhajang", "Gajaria", "Sirajdikhan", "Tongibari"]
    }
  },
  "Chattogram": {
    districts: {
      "Chattogram": ["Pahartali", "Patenga", "Karnaphuli", "Bayazid", "Foy's Lake", "Chandgaon", "Halishahar"],
      "Cox's Bazar": ["Ukhia", "Teknaf", "Chakaria", "Kutubdia", "Pekua", "Ramu", "Maheshkhali"],
      "Comilla": ["Comilla", "Laksham", "Nangalkot", "Daudkandi", "Homna", "Debidwar"],
      "Noakhali": ["Noakhali", "Begumganj", "Chatkhil", "Companiganj", "Subarnachar", "Senbagh"],
      "Brahmanbaria": ["Brahmanbaria", "Nabinagar", "Ashuganj", "Kasba", "Bijoynagar"]
    }
  },
  "Rajshahi": {
    districts: {
      "Rajshahi": ["Rajshahi", "Paba", "Tanore", "Bagha", "Charghat", "Durgapur", "Godagari"],
      "Naogaon": ["Naogaon", "Manda", "Raninagar", "Atrai", "Mahadebpur"],
      "Chapainawabganj": ["Chapainawabganj", "Shibganj", "Gomostapur", "Nachole", "Bholahat"],
      "Pabna": ["Pabna", "Faridpur", "Atghoria", "Santhia", "Shahzadpur"],
      "Kushtia": ["Kushtia", "Kumarkhali", "Daulatpur", "Mirpur", "Bheramara"]
    }
  },
  "Khulna": {
    districts: {
      "Khulna": ["Khulna", "Dighalia", "Batiaghata", "Koyra", "Paikgachha", "Rupsha"],
      "Jessore": ["Jessore", "Chaugachha", "Manirampur", "Shyamnagar", "Bagherpara"],
      "Satkhira": ["Satkhira", "Kaliganj", "Shyamnagar", "Assasuni", "Debhata", "Kalaroa"],
      "Bagerhat": ["Bagerhat", "Chitalmari", "Morrelganj", "Kachua", "Mongla"]
    }
  },
  "Barishal": {
    districts: {
      "Barishal": ["Barishal", "Bakerganj", "Wazirpur", "Gournadi", "Ujirpur", "Muladi"],
      "Patuakhali": ["Patuakhali", "Kalapara", "Dumki", "Bauphal", "Mirzaganj"],
      "Bhola": ["Bhola", "Lalmohon", "Charfashion", "Tazumuddin", "Dularhat", "Manpura"],
      "Jhalokathi": ["Jhalokathi", "Rajapur", "Kathalia", "Kuarakathi", "Nesarabad"]
    }
  },
  "Mymensingh": {
    districts: {
      "Mymensingh": ["Mymensingh", "Trishal", "Bhaluka", "Phulpur", "Muktagachha"],
      "Jamalpur": ["Jamalpur", "Islampur", "Sarishabari", "Madhupur", "Melandah"],
      "Netrokona": ["Netrokona", "Barhatta", "Kendua", "Durgapur", "Kalmakanda"],
      "Sherpur": ["Sherpur", "Jhenaigati", "Nakla", "Sreebardi", "Nababganj"]
    }
  },
  "Rangpur": {
    districts: {
      "Rangpur": ["Rangpur", "Pirganj", "Kaunia", "Mithapukur", "Gangachara", "Taraganj"],
      "Kurigram": ["Kurigram", "Bhurungamari", "Nageswari", "Rajibpur", "Ulipur"],
      "Gaibandha": ["Gaibandha", "Sundarganj", "Kamarjani", "Palashbari", "Shaghata"],
      "Dinajpur": ["Dinajpur", "Biral", "Ghoraghat", "Kaharol", "Parbatipur"],
      "Thakurgaon": ["Thakurgaon", "Baliadangi", "Pirganj", "Ranishankail", "Haripur"]
    }
  },
  "Sylhet": {
    districts: {
      "Sylhet": ["Sylhet", "Moulvibazar", "Jaintapur", "Fenchuganj", "Kanaighat", "Golapganj"],
      "Moulvibazar": ["Moulvibazar", "Kulaura", "Juri", "Barlekha", "Rajnagar"],
      "Habiganj": ["Habiganj", "Chunarughat", "Ajmiriganj", "Nabiganj", "Bahubal"],
      "Sunamganj": ["Sunamganj", "Chhatak", "Tahirpur", "Jagannathpur", "Doarabazar"]
    }
  }
};

export default bangladeshData;
