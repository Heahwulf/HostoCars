package fr.vulture.hostocars.system;

import static fr.vulture.hostocars.system.ResourceExtractor.extractApplicationTrayIcon;
import static org.springframework.boot.SpringApplication.exit;

import java.awt.AWTException;
import java.awt.Desktop;
import java.awt.MenuItem;
import java.awt.PopupMenu;
import java.awt.SystemTray;
import java.awt.Toolkit;
import java.awt.TrayIcon;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

/**
 * Helper to add a tray icon at application startup.
 */
@Slf4j
@Component
public class SystemTrayHelper implements InitializingBean {

    static {
        // Sets the java.awt.headless system property to enable the tray icon
        System.setProperty("java.awt.headless", "false");
    }

    @NonNull
    private final ApplicationContext applicationContext;
    @NonNull
    @Value("${server.address}")
    private String serverAddress;
    @NonNull
    @Value("${spring.application.name}")
    private String applicationName;
    @NonNull
    @Value("${server.port}")
    private String serverPort;

    /**
     * Valued autowired constructor.
     *
     * @param applicationContext
     *     The autowired {@link ApplicationContext} component
     */
    @Autowired
    public SystemTrayHelper(@NonNull final ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void afterPropertiesSet() {
        // Checks if the current system supports the system tray
        if (SystemTray.isSupported()) {
            log.debug("Adding the application tray icon to the system tray");

            try {
                // Gets the system tray factory
                final SystemTray tray = SystemTray.getSystemTray();

                // Extracts the URL of the tray icon resource file
                final URL resource = extractApplicationTrayIcon();

                // Creates the tray icon with the icon
                final TrayIcon trayIcon = new TrayIcon(Toolkit.getDefaultToolkit().getImage(resource), this.applicationName);

                // Generates the application URI
                final URI applicationUri = new URI("http://" + this.serverAddress + ':' + this.serverPort);

                // Adds an event listener to open a tab on the default browser with the application URI
                trayIcon.addActionListener(e -> {
                    try {
                        log.debug("Opening a new tab in the default browser with the URL : {}", applicationUri);

                        Desktop.getDesktop().browse(applicationUri);
                    } catch (final IOException exception) {
                        log.error("Failed to open a new tab in the default browser", exception);
                    }
                });

                // Creates a menu item for the tray icon in order to exit the application
                final MenuItem exitItem = new MenuItem("Quitter");

                // Adds an event listener to the exit menu item to remove the tray icon and exit the application
                exitItem.addActionListener(e -> {
                    log.debug("Removing the application tray icon from the system tray");

                    // Removes the tray icon
                    SystemTray.getSystemTray().remove(trayIcon);

                    log.info("Exiting the application");

                    // Exits the application
                    exit(this.applicationContext, () -> 0);
                });

                // Creates a popup menu for the tray icon
                final PopupMenu popupMenu = new PopupMenu();

                // Adds the exit menu item to the popup menu
                popupMenu.add(exitItem);

                // Adds the popup menu to the tray icon
                trayIcon.setPopupMenu(popupMenu);

                // Adds the tray icon to the system tray
                tray.add(trayIcon);
            } catch (final AWTException | IOException | URISyntaxException exception) {
                log.error("Tray icon could not to be added", exception);
            }
        } else {
            log.warn("System tray not supported on this platform");
        }
    }

}