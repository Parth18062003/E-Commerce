package com.hypehouse.inventory_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.logging.Logger;

@SpringBootApplication(scanBasePackages = {"com.hypehouse"})
public class InventoryServiceApplication {

	private static final Logger logger = Logger.getLogger(InventoryServiceApplication.class.getName());
	public static void main(String[] args) {
		SpringApplication.run(InventoryServiceApplication.class, args);
		logger.info("Inventory Service Application Started");
	}
}
/*

Communication Between Product and Inventory Microservices using RabbitMQ
Context: We are building a microservices architecture for an e-commerce platform, where there are two key services involved:

Product Service – Manages product data like SKU, variants, and product details.
Inventory Service – Manages inventory and stock levels for products, tracking stock quantities for various product variants.
Both services need to communicate efficiently, with the Product Service notifying the Inventory Service whenever a product is created or updated. To achieve this, we use RabbitMQ as the message broker for communication.

		Objective:
We aim to establish communication between these two services using RabbitMQ, where:

The Product Service sends events to RabbitMQ (such as product creation or update events).
The Inventory Service listens to these events and updates the inventory accordingly (e.g., creating inventory records for each variant of the product).
Key Concepts and Steps Involved:
		1. RabbitMQ Setup:
Product Service and Inventory Service will exchange data via RabbitMQ.
We’ll need a queue (e.g., inventory-queue) for the Inventory Service to listen for events (like product creation).
		2. Product Model & Event Structure:
In both services, the Product model needs to be compatible for sharing. However, since the Inventory Service doesn’t have the exact Product model, we’ll create two approaches to handle this:

Approach 1 (Full Product Model): Create a similar Product model in the Inventory Service.
		Approach 2 (DTO Approach): Use a simplified ProductDTO in the Inventory Service to handle just the necessary fields (e.g., SKU, variants, etc.).
For both approaches, the Product Service will send a message containing details about the product (including variants), and the Inventory Service will create inventory records based on this information.

3. Creating Models in Inventory Service:
Full Model Approach: In this approach, we create a Product model in the Inventory Service that mirrors the model in the Product Service. This model contains basic product details like id, sku, name, and variants.
DTO Approach: A ProductDTO will be created to include only the necessary data fields that the Inventory Service requires (e.g., id, sku, and variants).
		4. RabbitMQ Listener in Inventory Service:
The Inventory Service will have a listener that listens for messages from RabbitMQ whenever a product is created. Based on the product data received in the message, the Inventory Service will create inventory records for each product variant.

		java
Copy code
package com.hypehouse.inventory_service.listener;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class InventoryEventListener {

	private final InventoryService inventoryService;

	@Autowired
	public InventoryEventListener(InventoryService inventoryService) {
		this.inventoryService = inventoryService;
	}

	// Listen for product created events
	@RabbitListener(queues = "inventory-queue")
	public void receiveProductCreatedEvent(ProductDTO productDTO) {
		handleProductCreatedEvent(productDTO);  // Process the event and update inventory
	}
}
5. Event Handling and Inventory Update:
When the Inventory Service receives a product creation event, it will:

Extract product information (like id, sku, variants).
Create inventory records for each variant (e.g., SKU for size and color).
Set the initial stock quantities to 0 (or another default value).
Save the new inventory record in the Inventory Service database.
Example of handling product creation in Inventory Service:

java
Copy code
public void handleProductCreatedEvent(ProductDTO productDTO) {
	// For each variant of the product, create an inventory record
	productDTO.getVariants().forEach(variant -> {
		Inventory inventory = new Inventory();
		inventory.setProductId(productDTO.getId());
		inventory.setVariantSku(variant.getSku());
		inventory.setStockQuantity(0);  // Set initial stock to 0
		inventory.setAvailableStock(0);
		inventory.setReservedStock(0);
		inventory.setVariantSku(variant.getSku());
		inventoryService.save(inventory);
	});
}
6. Product Service: Publishing to RabbitMQ:
In the Product Service, whenever a product is created (for example, via the /create-product endpoint), an event is published to RabbitMQ to notify the Inventory Service:

java
Copy code
public void publishProductCreatedEvent(Product product) {
	// Create a ProductDTO or Product object to be sent to RabbitMQ
	ProductDTO productDTO = new ProductDTO();
	productDTO.setId(product.getId());
	productDTO.setSku(product.getSku());
	productDTO.setName(product.getName());
	productDTO.setVariants(product.getVariants());  // Add the variants if needed

	// Send the event to RabbitMQ (inventory-queue)
	rabbitTemplate.convertAndSend("inventory-queue", productDTO);
}
7. RabbitMQ Configuration:
Both services need to have RabbitMQ configured to communicate properly.

In Product Service (publisher):

java
Copy code
@Configuration
public class RabbitMQConfig {
	@Bean
	public Queue inventoryQueue() {
		return new Queue("inventory-queue", true);
	}

	@Bean
	public TopicExchange exchange() {
		return new TopicExchange("product-exchange");
	}

	@Bean
	public Binding binding(Queue inventoryQueue, TopicExchange exchange) {
		return BindingBuilder.bind(inventoryQueue).to(exchange).with("product.#");
	}
}
In Inventory Service (consumer):

java
Copy code
@Configuration
public class RabbitMQListenerConfig {
	@Bean
	public Queue inventoryQueue() {
		return new Queue("inventory-queue", true);
	}

	@Bean
	public TopicExchange exchange() {
		return new TopicExchange("product-exchange");
	}

	@Bean
	public Binding binding(Queue inventoryQueue, TopicExchange exchange) {
		return BindingBuilder.bind(inventoryQueue).to(exchange).with("product.#");
	}
}
Final Notes:
Event-Driven Design: This integration allows both services to stay decoupled and communicate asynchronously.
		Scalability: RabbitMQ will allow the services to scale better, as events are placed in a queue and processed independently by the Inventory Service.
Handling Errors: You should handle cases where RabbitMQ might not be available, or the data format is incorrect, possibly implementing retries or dead-letter queues.
Data Consistency: Ensure that both services handle failures correctly, and that inventory is not updated if product data is incomplete or invalid.
Summary of Workflow:
Product Service creates a new product and publishes an event to RabbitMQ.
Inventory Service listens to RabbitMQ, processes the product creation event, and updates the inventory based on the product's variants.
RabbitMQ ensures that communication between the two services is asynchronous and scalable.*/
