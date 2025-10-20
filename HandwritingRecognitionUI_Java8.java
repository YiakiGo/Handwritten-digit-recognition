import javax.swing.*;
import javax.swing.border.*;
import java.awt.*;
import java.awt.event.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import javax.imageio.ImageIO;
import java.util.Base64;

public class HandwritingRecognitionUI_Java8 extends JFrame {
    private DrawingPanel drawingPanel;
    private JTextArea resultArea;
    private JLabel statusLabel;
    private JButton recognizeButton, clearButton, loadImageButton;
    private JPanel headerPanel, controlPanel, resultPanel;
    private String apiUrl = "http://localhost:5000/predict";

    // Color scheme
    private final Color PRIMARY_COLOR = new Color(41, 128, 185);
    private final Color SECONDARY_COLOR = new Color(52, 152, 219);
    private final Color ACCENT_COLOR = new Color(46, 204, 113);
    private final Color BACKGROUND_COLOR = new Color(245, 245, 245);
    private final Color CARD_COLOR = Color.WHITE;
    private final Color TEXT_COLOR = new Color(52, 73, 94);

    public HandwritingRecognitionUI_Java8() {
        initializeUI();
    }

    private void initializeUI() {
        setTitle("✍️ MNIST Digit Recognition");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout(10, 10));
        getContentPane().setBackground(BACKGROUND_COLOR);

        createHeader();
        createDrawingArea();
        createControlPanel();
        createResultArea();

        pack();
        setMinimumSize(new Dimension(800, 700));
        setLocationRelativeTo(null);
        setVisible(true);
    }

    private void createHeader() {
        headerPanel = new JPanel();
        headerPanel.setLayout(new BorderLayout());
        headerPanel.setBackground(PRIMARY_COLOR);
        headerPanel.setBorder(BorderFactory.createEmptyBorder(15, 20, 15, 20));

        JLabel titleLabel = new JLabel("MNIST Digit Recognition");
        titleLabel.setForeground(Color.WHITE);
        titleLabel.setFont(new Font("Segoe UI", Font.BOLD, 24));
        
        JLabel subtitleLabel = new JLabel("Draw a digit (0-9) and let AI recognize it");
        subtitleLabel.setForeground(new Color(236, 240, 241));
        subtitleLabel.setFont(new Font("Segoe UI", Font.PLAIN, 12));

        JPanel textPanel = new JPanel(new BorderLayout());
        textPanel.setBackground(PRIMARY_COLOR);
        textPanel.add(titleLabel, BorderLayout.NORTH);
        textPanel.add(subtitleLabel, BorderLayout.SOUTH);

        JLabel iconLabel = new JLabel("🔢");
        iconLabel.setFont(new Font("Segoe UI", Font.PLAIN, 28));
        iconLabel.setForeground(Color.WHITE);
        iconLabel.setBorder(BorderFactory.createEmptyBorder(0, 0, 0, 10));

        headerPanel.add(iconLabel, BorderLayout.WEST);
        headerPanel.add(textPanel, BorderLayout.CENTER);

        add(headerPanel, BorderLayout.NORTH);
    }

    private void createDrawingArea() {
        JPanel drawingContainer = new JPanel(new BorderLayout());
        drawingContainer.setBackground(BACKGROUND_COLOR);
        drawingContainer.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        JLabel drawingLabel = new JLabel(" Drawing Canvas - Draw a single digit (0-9)");
        drawingLabel.setFont(new Font("Segoe UI", Font.BOLD, 16));
        drawingLabel.setForeground(TEXT_COLOR);
        drawingLabel.setBorder(BorderFactory.createEmptyBorder(5, 5, 10, 5));

        drawingPanel = new DrawingPanel();
        drawingPanel.setPreferredSize(new Dimension(280, 280));
        
        JPanel cardPanel = new JPanel(new BorderLayout());
        cardPanel.setBackground(CARD_COLOR);
        cardPanel.setBorder(BorderFactory.createCompoundBorder(
            new LineBorder(new Color(220, 220, 220), 1),
            BorderFactory.createEmptyBorder(10, 10, 10, 10)
        ));
        cardPanel.add(drawingPanel, BorderLayout.CENTER);

        drawingContainer.add(drawingLabel, BorderLayout.NORTH);
        drawingContainer.add(cardPanel, BorderLayout.CENTER);

        add(drawingContainer, BorderLayout.CENTER);
    }

    private void createControlPanel() {
        controlPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 15, 10));
        controlPanel.setBackground(BACKGROUND_COLOR);
        controlPanel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        recognizeButton = createStyledButton("🔍 Recognize Digit", ACCENT_COLOR);
        clearButton = createStyledButton("🗑️ Clear Canvas", new Color(231, 76, 60));
        loadImageButton = createStyledButton("📁 Load Image", SECONDARY_COLOR);

        controlPanel.add(recognizeButton);
        controlPanel.add(clearButton);
        controlPanel.add(loadImageButton);

        add(controlPanel, BorderLayout.SOUTH);
    }

    private JButton createStyledButton(String text, Color color) {
        JButton button = new JButton(text);
        button.setFont(new Font("Segoe UI", Font.BOLD, 14));
        button.setBackground(color);
        button.setForeground(Color.WHITE);
        button.setFocusPainted(false);
        button.setBorder(BorderFactory.createCompoundBorder(
            new LineBorder(color.darker(), 1),
            BorderFactory.createEmptyBorder(8, 15, 8, 15)
        ));
        button.setCursor(new Cursor(Cursor.HAND_CURSOR));

        button.addMouseListener(new MouseAdapter() {
            public void mouseEntered(MouseEvent e) {
                button.setBackground(color.brighter());
            }
            
            public void mouseExited(MouseEvent e) {
                button.setBackground(color);
            }
        });

        if (text.contains("Recognize")) {
            button.addActionListener(new ActionListener() {
                public void actionPerformed(ActionEvent e) {
                    recognizeHandwriting();
                }
            });
        } else if (text.contains("Clear")) {
            button.addActionListener(new ActionListener() {
                public void actionPerformed(ActionEvent e) {
                    clearCanvas();
                }
            });
        } else if (text.contains("Load")) {
            button.addActionListener(new ActionListener() {
                public void actionPerformed(ActionEvent e) {
                    loadImage();
                }
            });
        }

        return button;
    }

    private void createResultArea() {
        resultPanel = new JPanel(new BorderLayout());
        resultPanel.setBackground(BACKGROUND_COLOR);
        resultPanel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        JLabel resultLabel = new JLabel(" Recognition Results");
        resultLabel.setFont(new Font("Segoe UI", Font.BOLD, 16));
        resultLabel.setForeground(TEXT_COLOR);
        resultLabel.setBorder(BorderFactory.createEmptyBorder(5, 5, 10, 5));

        resultArea = new JTextArea(8, 30);
        resultArea.setEditable(false);
        resultArea.setFont(new Font("Consolas", Font.PLAIN, 13));
        resultArea.setLineWrap(true);
        resultArea.setWrapStyleWord(true);
        resultArea.setBackground(CARD_COLOR);
        resultArea.setForeground(TEXT_COLOR);
        resultArea.setBorder(BorderFactory.createCompoundBorder(
            new LineBorder(new Color(220, 220, 220), 1),
            BorderFactory.createEmptyBorder(10, 10, 10, 10)
        ));

        JScrollPane resultScrollPane = new JScrollPane(resultArea);
        resultScrollPane.setBorder(BorderFactory.createEmptyBorder());
        resultScrollPane.getViewport().setBackground(CARD_COLOR);

        statusLabel = new JLabel("🟢 Ready to draw digits...");
        statusLabel.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        statusLabel.setForeground(new Color(88, 88, 88));
        statusLabel.setBorder(BorderFactory.createEmptyBorder(5, 5, 0, 5));

        JPanel cardPanel = new JPanel(new BorderLayout());
        cardPanel.setBackground(CARD_COLOR);
        cardPanel.setBorder(BorderFactory.createCompoundBorder(
            new LineBorder(new Color(220, 220, 220), 1),
            BorderFactory.createEmptyBorder(10, 10, 10, 10)
        ));
        cardPanel.add(resultScrollPane, BorderLayout.CENTER);
        cardPanel.add(statusLabel, BorderLayout.SOUTH);

        resultPanel.add(resultLabel, BorderLayout.NORTH);
        resultPanel.add(cardPanel, BorderLayout.CENTER);

        add(resultPanel, BorderLayout.EAST);
    }

    private void recognizeHandwriting() {
        // Check if canvas is empty
        if (isCanvasEmpty()) {
            JOptionPane.showMessageDialog(this,
                "Please draw a digit on the canvas first!",
                "Empty Canvas",
                JOptionPane.WARNING_MESSAGE);
            return;
        }

        SwingWorker<String, Void> worker = new SwingWorker<String, Void>() {
            @Override
            protected String doInBackground() throws Exception {
                statusLabel.setText("🟡 Processing... Analyzing your digit");
                
                BufferedImage image = drawingPanel.getImage();
                String base64Image = imageToBase64(image);
                
                return sendToBackend(base64Image);
            }
            
            @Override
            protected void done() {
                try {
                    String result = get();
                    resultArea.setText(result);
                    statusLabel.setText("🟢 Recognition complete");
                } catch (Exception ex) {
                    resultArea.setText("❌ Error: " + ex.getMessage());
                    statusLabel.setText("🔴 Recognition failed");
                    ex.printStackTrace();
                }
            }
        };
        worker.execute();
    }

    private boolean isCanvasEmpty() {
        BufferedImage image = drawingPanel.getImage();
        // Check if image is mostly white (empty)
        int whitePixels = 0;
        int totalPixels = image.getWidth() * image.getHeight();
        
        for (int x = 0; x < image.getWidth(); x++) {
            for (int y = 0; y < image.getHeight(); y++) {
                int rgb = image.getRGB(x, y);
                if (rgb == Color.WHITE.getRGB() || rgb == -1) {
                    whitePixels++;
                }
            }
        }
        
        // If more than 95% of pixels are white, consider canvas empty
        return (whitePixels * 100 / totalPixels) > 95;
    }

    private String sendToBackend(String base64Image) {
        try {
            URL url = new URL(apiUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("Accept", "application/json");
            conn.setDoOutput(true);
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(10000);
            
            // Remove data URL prefix if present
            if (base64Image.startsWith("data:image")) {
                base64Image = base64Image.split(",")[1];
            }
            
            String requestBody = "{\"image\":\"" + base64Image + "\"}";
            
            System.out.println("🔄 Sending request to backend...");
            
            OutputStream os = conn.getOutputStream();
            try {
                byte[] input = requestBody.getBytes("utf-8");
                os.write(input, 0, input.length);
            } finally {
                os.close();
            }
            
            int responseCode = conn.getResponseCode();
            System.out.println("📡 Response code: " + responseCode);
            
            if (responseCode == HttpURLConnection.HTTP_OK) {
                BufferedReader in = new BufferedReader(
                    new InputStreamReader(conn.getInputStream()));
                String inputLine;
                StringBuilder response = new StringBuilder();
                
                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
                in.close();
                
                String responseStr = response.toString();
                System.out.println("✅ Raw response: " + responseStr);
                
                return parseJsonResponse(responseStr);
                
            } else {
                // Try to read error stream
                String errorMessage = "HTTP Error " + responseCode;
                try {
                    BufferedReader errorReader = new BufferedReader(
                        new InputStreamReader(conn.getErrorStream()));
                    String errorLine;
                    StringBuilder errorResponse = new StringBuilder();
                    while ((errorLine = errorReader.readLine()) != null) {
                        errorResponse.append(errorLine);
                    }
                    errorReader.close();
                    errorMessage += ": " + errorResponse.toString();
                } catch (Exception e) {
                    errorMessage += " - Could not read error response";
                }
                
                return "❌ " + errorMessage;
            }
        } catch (Exception e) {
            return "🔌 Connection error: " + e.getMessage() + 
                   "\n\nMake sure the Flask server is running on http://localhost:5000";
        }
    }
    
    private String parseJsonResponse(String json) {
        try {
            // Check for MNIST API response format
            if (json.contains("\"status\":\"success\"")) {
                String predictedDigit = extractValue(json, "predicted_digit");
                String confidence = extractValue(json, "confidence");
                
                StringBuilder result = new StringBuilder();
                result.append("✅ DIGIT RECOGNITION SUCCESSFUL\n");
                result.append("──────────────────────────────\n\n");
                result.append("🔢 Predicted Digit: ").append(predictedDigit).append("\n\n");
                result.append("🎯 Confidence: ").append(confidence).append("\n\n");
                
                // Extract top predictions
                if (json.contains("all_predictions")) {
                    result.append("📊 Top Predictions:\n");
                    result.append("──────────────────\n");
                    
                    // Simple extraction of top predictions
                    String predictionsPart = json.substring(json.indexOf("all_predictions"));
                    String[] predictions = predictionsPart.split("\\},\\s*\\{");
                    
                    for (int i = 0; i < Math.min(predictions.length, 3); i++) {
                        String pred = predictions[i];
                        String digit = extractValueFromSubstring(pred, "digit");
                        String conf = extractValueFromSubstring(pred, "confidence");
                        
                        if (!digit.equals("N/A") && !conf.equals("N/A")) {
                            try {
                                double confValue = Double.parseDouble(conf) * 100;
                                result.append("• Digit ").append(digit)
                                      .append(": ").append(String.format("%.1f", confValue))
                                      .append("%\n");
                            } catch (NumberFormatException e) {
                                result.append("• Digit ").append(digit)
                                      .append(": ").append(conf).append("\n");
                            }
                        }
                    }
                }
                
                return result.toString();
            } else if (json.contains("\"error\"")) {
                String error = extractValue(json, "error");
                return "❌ RECOGNITION FAILED\n───────────────────\n\nReason: " + error;
            } else {
                return "⚠️  Unexpected response format:\n\n" + json;
            }
        } catch (Exception e) {
            return "⚠️  Error parsing response: " + e.getMessage() + "\n\nRaw data:\n" + json;
        }
    }
    
    private String extractValue(String json, String key) {
        try {
            String searchKey = "\"" + key + "\":";
            int keyIndex = json.indexOf(searchKey);
            if (keyIndex == -1) return "N/A";
            
            int valueStart = keyIndex + searchKey.length();
            int valueEnd = json.indexOf(",", valueStart);
            if (valueEnd == -1) valueEnd = json.indexOf("}", valueStart);
            if (valueEnd == -1) return "N/A";
            
            String value = json.substring(valueStart, valueEnd).trim();
            
            if (value.startsWith("\"") && value.endsWith("\"")) {
                value = value.substring(1, value.length() - 1);
            }
            
            return value;
        } catch (Exception e) {
            return "N/A";
        }
    }
    
    private String extractValueFromSubstring(String substring, String key) {
        try {
            String searchKey = "\"" + key + "\":";
            int keyIndex = substring.indexOf(searchKey);
            if (keyIndex == -1) return "N/A";
            
            int valueStart = keyIndex + searchKey.length();
            int valueEnd = substring.indexOf(",", valueStart);
            if (valueEnd == -1) valueEnd = substring.indexOf("}", valueStart);
            if (valueEnd == -1) return "N/A";
            
            String value = substring.substring(valueStart, valueEnd).trim();
            
            if (value.startsWith("\"") && value.endsWith("\"")) {
                value = value.substring(1, value.length() - 1);
            }
            
            return value;
        } catch (Exception e) {
            return "N/A";
        }
    }

    private String imageToBase64(BufferedImage image) {
        try {
            // Resize image to 28x28 for better MNIST compatibility
            BufferedImage resizedImage = new BufferedImage(28, 28, BufferedImage.TYPE_INT_RGB);
            Graphics2D g = resizedImage.createGraphics();
            g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
            g.setColor(Color.WHITE);
            g.fillRect(0, 0, 28, 28);
            g.drawImage(image, 0, 0, 28, 28, null);
            g.dispose();
            
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(resizedImage, "png", baos);
            byte[] imageBytes = baos.toByteArray();
            
            // Use Java 8 Base64 encoder
            String base64 = Base64.getEncoder().encodeToString(imageBytes);
            return "data:image/png;base64," + base64;
        } catch (Exception e) {
            throw new RuntimeException("Error converting image to base64: " + e.getMessage());
        }
    }

    private void clearCanvas() {
        drawingPanel.clear();
        resultArea.setText("");
        statusLabel.setText("🟢 Canvas cleared - ready for new digit");
    }

    private void loadImage() {
        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setDialogTitle("📁 Select Digit Image");
        fileChooser.setFileFilter(new javax.swing.filechooser.FileNameExtensionFilter(
            "Image files (JPG, PNG, BMP, GIF)", "jpg", "jpeg", "png", "bmp", "gif"));
        
        int result = fileChooser.showOpenDialog(this);
        if (result == JFileChooser.APPROVE_OPTION) {
            File selectedFile = fileChooser.getSelectedFile();
            try {
                BufferedImage image = ImageIO.read(selectedFile);
                drawingPanel.setImage(image);
                statusLabel.setText("🟢 Image loaded: " + selectedFile.getName());
                resultArea.setText("📁 Image loaded successfully!\n\nClick 'Recognize Digit' to analyze.");
            } catch (Exception e) {
                JOptionPane.showMessageDialog(this, 
                    "❌ Error loading image:\n" + e.getMessage(),
                    "Load Error", 
                    JOptionPane.ERROR_MESSAGE);
            }
        }
    }

    public static void main(String[] args) {
        // Java 8 compatible look and feel setup
        try {
            UIManager.setLookAndFeel(UIManager.getCrossPlatformLookAndFeelClassName());
        } catch (Exception e) {
            System.out.println("Warning: Could not set look and feel");
        }
        
        SwingUtilities.invokeLater(new Runnable() {
            public void run() {
                new HandwritingRecognitionUI_Java8();
            }
        });
    }
}

class DrawingPanel extends JPanel {
    private BufferedImage image;
    private Graphics2D g2d;
    private int prevX, prevY;
    private boolean drawing = false;

    public DrawingPanel() {
        setBackground(Color.WHITE);
        setBorder(BorderFactory.createLineBorder(new Color(200, 200, 200), 1));
        setCursor(Cursor.getPredefinedCursor(Cursor.CROSSHAIR_CURSOR));
        addMouseListeners();
        clear();
    }

    private void addMouseListeners() {
        addMouseListener(new MouseAdapter() {
            public void mousePressed(MouseEvent e) {
                prevX = e.getX();
                prevY = e.getY();
                drawing = true;
            }
            
            public void mouseReleased(MouseEvent e) {
                drawing = false;
            }
        });
        
        addMouseMotionListener(new MouseMotionAdapter() {
            public void mouseDragged(MouseEvent e) {
                if (drawing && g2d != null) {
                    int x = e.getX();
                    int y = e.getY();
                    
                    g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                    g2d.setStroke(new BasicStroke(15, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
                    g2d.setColor(Color.BLACK);
                    g2d.drawLine(prevX, prevY, x, y);
                    
                    prevX = x;
                    prevY = y;
                    repaint();
                }
            }
        });
    }

    public void clear() {
        image = new BufferedImage(280, 280, BufferedImage.TYPE_INT_RGB);
        g2d = image.createGraphics();
        
        // White background
        g2d.setColor(Color.WHITE);
        g2d.fillRect(0, 0, image.getWidth(), image.getHeight());
        
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2d.setColor(Color.BLACK);
        
        repaint();
    }

    public void setImage(BufferedImage newImage) {
        this.image = new BufferedImage(280, 280, BufferedImage.TYPE_INT_RGB);
        g2d = this.image.createGraphics();
        
        // White background
        g2d.setColor(Color.WHITE);
        g2d.fillRect(0, 0, this.image.getWidth(), this.image.getHeight());
        
        // Draw the loaded image
        g2d.drawImage(newImage, 0, 0, getWidth(), getHeight(), this);
        repaint();
    }

    public BufferedImage getImage() {
        return image;
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2d = (Graphics2D) g;
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        
        if (image != null) {
            g2d.drawImage(image, 0, 0, getWidth(), getHeight(), this);
        }
    }
}