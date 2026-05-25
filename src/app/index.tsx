import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

const API_URL = "https://movieshelf-api-ejme.onrender.com";

type Movie = {
  _id: string;
  title: string;
  genre: string;
  rating: number;
  created_at: string;
};

export default function HomeScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const getMovies = async () => {
    try {
      const response = await fetch(`${API_URL}/api/movies`);
      const data = await response.json();
      setMovies(data);
    } catch {
      Alert.alert("Error", "Could not load movies.");
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  const resetForm = () => {
    setTitle("");
    setGenre("");
    setRating("");
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!title || !genre || !rating) {
      Alert.alert("Missing Info", "Please fill out all fields.");
      return;
    }

    const movieData = {
      title,
      genre,
      rating: Number(rating)
    };

    try {
      if (editingId) {
        await fetch(`${API_URL}/api/movies/${editingId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(movieData)
        });
      } else {
        await fetch(`${API_URL}/api/movies`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(movieData)
        });
      }

      resetForm();
      getMovies();
    } catch {
      Alert.alert("Error", "Could not save movie.");
    }
  };

  const handleEdit = (movie: Movie) => {
    setEditingId(movie._id);
    setTitle(movie.title);
    setGenre(movie.genre);
    setRating(String(movie.rating));
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${API_URL}/api/movies/${id}`, {
        method: "DELETE"
      });

      getMovies();
    } catch {
      Alert.alert("Error", "Could not delete movie.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.title}>MovieShelf Mobile</Text>
        <Text style={styles.subtitle}>
          A React Native CRUD client connected to my deployed MovieShelf API.
        </Text>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>
            {editingId ? "Update Movie" : "Add a Movie"}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Movie Title"
            placeholderTextColor="#8f9aae"
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={styles.input}
            placeholder="Genre"
            placeholderTextColor="#8f9aae"
            value={genre}
            onChangeText={setGenre}
          />

          <TextInput
            style={styles.input}
            placeholder="Rating 1-10"
            placeholderTextColor="#8f9aae"
            value={rating}
            onChangeText={setRating}
            keyboardType="numeric"
          />

          <Pressable style={styles.primaryButton} onPress={handleSubmit}>
            <Text style={styles.primaryButtonText}>
              {editingId ? "Save Update" : "Add Movie"}
            </Text>
          </Pressable>

          {editingId && (
            <Pressable style={styles.cancelButton} onPress={resetForm}>
              <Text style={styles.cancelButtonText}>Cancel Edit</Text>
            </Pressable>
          )}
        </View>

        <FlatList
          data={movies}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.movieCard}>
              <Text style={styles.movieTitle}>{item.title}</Text>
              <Text style={styles.movieText}>Genre: {item.genre}</Text>
              <Text style={styles.movieText}>Rating: {item.rating}/10</Text>
              <Text style={styles.movieDate}>
                Added: {new Date(item.created_at).toLocaleDateString()}
              </Text>

              <View style={styles.actions}>
                <Pressable
                  style={styles.editButton}
                  onPress={() => handleEdit(item)}
                >
                  <Text style={styles.actionText}>Edit</Text>
                </Pressable>

                <Pressable
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item._id)}
                >
                  <Text style={styles.actionText}>Delete</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#10131a"
  },
  container: {
    flex: 1,
    padding: 20
  },
  title: {
    color: "#ffb347",
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 20
  },
  subtitle: {
    color: "#f5f5f5",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 24,
    lineHeight: 22
  },
  formCard: {
    backgroundColor: "#1d2330",
    padding: 18,
    borderRadius: 16,
    marginBottom: 20
  },
  formTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 14
  },
  input: {
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    color: "#111827"
  },
  primaryButton: {
    backgroundColor: "#ffb347",
    padding: 14,
    borderRadius: 10,
    alignItems: "center"
  },
  primaryButtonText: {
    color: "#111827",
    fontWeight: "800"
  },
  cancelButton: {
    marginTop: 10,
    padding: 12,
    alignItems: "center"
  },
  cancelButtonText: {
    color: "#ffb347",
    fontWeight: "700"
  },
  list: {
    paddingBottom: 30
  },
  movieCard: {
    backgroundColor: "#252c3b",
    padding: 18,
    borderRadius: 16,
    marginBottom: 16
  },
  movieTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8
  },
  movieText: {
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 5
  },
  movieDate: {
    color: "#c8ced8",
    marginTop: 4,
    marginBottom: 14
  },
  actions: {
    flexDirection: "row",
    gap: 10
  },
  editButton: {
    backgroundColor: "#ffb347",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10
  },
  deleteButton: {
    backgroundColor: "#ff6961",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10
  },
  actionText: {
    color: "#111827",
    fontWeight: "800"
  }
});