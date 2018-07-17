package noahs.ark.noahs_ark;

import com.google.api.core.ApiFuture;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import com.google.gson.*;
import static spark.Spark.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.EmptyStackException;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutionException;

import javax.annotation.Nullable;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

class CustomerObj {
	String id;
	Map <String, Object> data;
	
	CustomerObj(String id, Map<String, Object> data) {
		this.id = id;
		this.data = data;
	}
}

public class App {
	
    public static void main(String[] args) throws ExecutionException, Throwable {
    	InputStream serviceAccount = new FileInputStream("C:/Users/Noah/eclipse-workspace/java-customer-api/java-api-db08e-firebase-adminsdk-5b1qb-66a18ac44e.json");
		GoogleCredentials credentials = GoogleCredentials.fromStream(serviceAccount);
		FirebaseOptions options = new FirebaseOptions.Builder()
		    .setCredentials(credentials)
		    .build();
		FirebaseApp.initializeApp(options);
    	options("/*",
    	        (request, response) -> {

    	            String accessControlRequestHeaders = request
    	                    .headers("Access-Control-Request-Headers");
    	            if (accessControlRequestHeaders != null) {
    	                response.header("Access-Control-Allow-Headers",
    	                        accessControlRequestHeaders);
    	            }

    	            String accessControlRequestMethod = request
    	                    .headers("Access-Control-Request-Method");
    	            if (accessControlRequestMethod != null) {
    	                response.header("Access-Control-Allow-Methods",
    	                        accessControlRequestMethod);
    	            }

    	            return "OK";
    	        });

    	before((request, response) -> response.header("Access-Control-Allow-Origin", "*"));
    	get("/customers", (req, res) -> {
    		CountDownLatch done = new CountDownLatch(1);
    		Firestore db = FirestoreClient.getFirestore();
    		ApiFuture<QuerySnapshot> query = db.collection("customers").get();
    		
    		QuerySnapshot querySnapshot = query.get();
    		List<QueryDocumentSnapshot> documents = querySnapshot.getDocuments();
    		
    		int i = 0;
    		
    		List<CustomerObj> docList = new ArrayList<CustomerObj>();
    		
    		for (QueryDocumentSnapshot document : documents) {
    			CustomerObj customerObj = new CustomerObj(document.getId(), document.getData());
    			docList.add(customerObj);
    			i++;
    			
    			if(i == documents.toArray().length) {
    				done.countDown();
    			}
    		}
    		
    		Gson gson = new Gson();
    		String json = gson.toJson(docList);
    		
    		done.await();
    		return json;
    	});
        get("/customers/:id", (req, res) -> {
        	CountDownLatch done = new CountDownLatch(1);
    		Firestore db = FirestoreClient.getFirestore();
        	String id = req.params("id");
        	CustomerObj customerObj = null;
        	Gson gson = new Gson();
        	
        	DocumentReference docRef = db.collection("customers").document(id);
        	ApiFuture<DocumentSnapshot> future = docRef.get();
        	DocumentSnapshot document = future.get();
        	
        	if (document.exists()) {
        	  customerObj = new CustomerObj(id, document.getData());
        	  done.countDown();
        	}
        	
        	done.await();
    		return gson.toJson(customerObj);
 
        });
        
    }
}