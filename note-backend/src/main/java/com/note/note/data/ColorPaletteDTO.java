package com.note.note.data;

import java.util.List;

public class ColorPaletteDTO {

    private Long id;
    private String name;
    private List<Color> colorList; 
    
	public ColorPaletteDTO() {

	}
    
    public ColorPaletteDTO(Long id, String name, List<Color> colorList) {
        super();
        this.id = id; 
        this.name = name;
        this.colorList = colorList; 
        
       }
 

	public void setId(Long id) {
       	this.id = id; 
       }
       
       public Long getId() {
       	return id; 
       }
       
       public void setColorList(List<Color> colorList) {
       	this.colorList = colorList; 
       }
       
       public List<Color> getColorList(){
       	return colorList; 
       }
       
       public String getName () {
       	return name; 
       }
       
       public void setName (String name) {
   	   this.name = name; 
       }
 
}
